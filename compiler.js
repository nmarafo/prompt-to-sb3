/**
 * prompt-to-sb3 | Scratch 3.0 Compiler Engine
 * Interpreta JSON semántico (NotebookLM / Agentes IA) o project.json nativo y compila a .sb3
 * 
 * @author Norberto Martín Afonso (@nmarafo)
 * @license CC BY-SA 4.0
 */

// Utilidad de Consola en Pantalla
const Console = {
    el: document.getElementById('console'),
    log(msg, type = 'info') {
        if (!this.el) return;
        const line = document.createElement('div');
        line.className = `console-line ${type}`;
        const time = new Date().toLocaleTimeString();
        line.innerHTML = `<span class="console-timestamp">[${time}]</span> <span class="console-msg">${msg}</span>`;
        this.el.appendChild(line);
        this.el.scrollTop = this.el.scrollHeight;
    },
    clear() {
        if (this.el) this.el.innerHTML = '';
    }
};

function generateId(prefix = '') {
    return prefix + Math.random().toString(36).substring(2, 12).toUpperCase();
}

// Plantilla estándar de Scratch 3.0
const SCRATCH_TEMPLATE = {
    targets: [
        {
            isStage: true,
            name: "Stage",
            variables: {},
            lists: {},
            broadcasts: {},
            blocks: {},
            comments: {},
            currentCostume: 0,
            costumes: [
                {
                    name: "backdrop1",
                    dataFormat: "svg",
                    assetId: "cd21514d0531fdffb22204e0ec5ed84a",
                    md5ext: "cd21514d0531fdffb22204e0ec5ed84a.svg",
                    rotationCenterX: 240,
                    rotationCenterY: 180
                }
            ],
            sounds: [
                {
                    name: "pop",
                    assetId: "83a9787d4cb6f3b7632b4ddfebf74367",
                    dataFormat: "wav",
                    format: "",
                    rate: 48000,
                    sampleCount: 1123,
                    md5ext: "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            volume: 100,
            layerOrder: 0,
            tempo: 60,
            videoTransparency: 50,
            videoState: "on",
            textToSpeechLanguage: null
        }
    ],
    monitors: [],
    extensions: [],
    meta: {
        semver: "3.0.0",
        vm: "0.2.0-prerelease.2023",
        agent: "prompt-to-sb3 Compiler Tool v2.0 (by @nmarafo)"
    }
};

// Activos base embebidos en Base64 para garantizar soporte 100% offline (sin restricciones CORS de file://)
let EMBEDDED_ASSETS = {};

class ScratchCompiler {
    constructor() {
        this.zip = null;
        this.baseAssetNames = [
            'cd21514d0531fdffb22204e0ec5ed84a.svg',
            'bcf454acf82e4504149f7ffe07081dbc.svg',
            '0fb9be3e8397c983338cb71dc84d0b25.svg',
            '83a9787d4cb6f3b7632b4ddfebf74367.wav',
            '83c36d806dc92327b9e7049a565c6bff.wav'
        ];
    }

    base64ToBlob(base64, mimeType) {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    }

    async getAssetBlob(filename) {
        // 1. Intentar carga vía fetch local
        try {
            const resp = await fetch(`assets/${filename}`);
            if (resp.ok) {
                return await resp.blob();
            }
        } catch (e) {
            // Continuar con fallback embebido
        }

        // 2. Fallback a activos base64 embebidos
        if (EMBEDDED_ASSETS && EMBEDDED_ASSETS[filename]) {
            const ext = filename.split('.').pop();
            const mime = ext === 'svg' ? 'image/svg+xml' : (ext === 'wav' ? 'audio/wav' : 'application/octet-stream');
            return this.base64ToBlob(EMBEDDED_ASSETS[filename], mime);
        }

        return null;
    }

    async fetchExternalImage(url) {
        Console.log(`Descargando activo externo: ${url}...`, 'info');
        
        // Intentar descarga directa
        try {
            const resp = await fetch(url, { mode: 'cors' });
            if (resp.ok) return await resp.blob();
        } catch (err) {
            Console.log(`Aviso de CORS al descargar directamente: ${err.message}. Intentando vía proxy público...`, 'warning');
        }

        // Intento secundario con proxy CORS para Wikimedia Commons u otros repositorios abiertos
        try {
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
            const respProxy = await fetch(proxyUrl);
            if (respProxy.ok) {
                Console.log(`Descargado con éxito vía proxy CORS.`, 'success');
                return await respProxy.blob();
            }
        } catch (err2) {
            Console.log(`No se pudo descargar la imagen externa. Se aplicará el disfraz predeterminado.`, 'warning');
        }

        return null;
    }

    mapActionToBlock(action, nextId, parentId, variablesMap) {
        const id = generateId('b_');
        let block = {
            opcode: "",
            next: nextId,
            parent: parentId,
            inputs: {},
            fields: {},
            shadow: false,
            topLevel: !parentId
        };

        switch (action.type) {
            case 'start':
                block.opcode = "event_whenflagclicked";
                block.x = action.x || 100;
                block.y = action.y || 100;
                break;

            case 'move':
                if (action.x !== undefined || action.y !== undefined) {
                    block.opcode = "motion_gotoxy";
                    block.inputs.X = [1, [4, String(action.x || 0)]];
                    block.inputs.Y = [1, [4, String(action.y || 0)]];
                } else {
                    block.opcode = "motion_movesteps";
                    block.inputs.STEPS = [1, [4, String(action.steps || 10)]];
                }
                break;

            case 'glide':
                block.opcode = "motion_glidesecstoxy";
                block.inputs.SECS = [1, [4, String(action.seconds || action.duration || 1)]];
                block.inputs.X = [1, [4, String(action.x || 0)]];
                block.inputs.Y = [1, [4, String(action.y || 0)]];
                break;

            case 'say':
                if (action.seconds || action.duration) {
                    block.opcode = "looks_sayforsecs";
                    block.inputs.MESSAGE = [1, [10, String(action.text || "")]];
                    block.inputs.SECS = [1, [4, String(action.seconds || action.duration)]];
                } else {
                    block.opcode = "looks_say";
                    block.inputs.MESSAGE = [1, [10, String(action.text || "")]];
                }
                break;

            case 'think':
                if (action.seconds || action.duration) {
                    block.opcode = "looks_thinkforsecs";
                    block.inputs.MESSAGE = [1, [10, String(action.text || "")]];
                    block.inputs.SECS = [1, [4, String(action.seconds || action.duration)]];
                } else {
                    block.opcode = "looks_think";
                    block.inputs.MESSAGE = [1, [10, String(action.text || "")]];
                }
                break;

            case 'wait':
                block.opcode = "control_wait";
                block.inputs.DURATION = [1, [5, String(action.seconds || action.duration || 1)]];
                break;

            case 'costume':
                block.opcode = "looks_switchcostumeto";
                block.inputs.COSTUME = [1, [10, String(action.name || "costume1")]];
                break;

            case 'backdrop':
                block.opcode = "looks_switchbackdropto";
                block.inputs.BACKDROP = [1, [10, String(action.name || "backdrop1")]];
                break;

            case 'playsound':
                block.opcode = "sound_playuntildone";
                block.inputs.SOUND_MENU = [1, [10, String(action.name || "pop")]];
                break;

            case 'set_var':
                block.opcode = "data_setvariableto";
                const varName = action.name || "puntos";
                const varId = variablesMap[varName] || varName;
                block.fields.VARIABLE = [varName, varId];
                block.inputs.VALUE = [1, [10, String(action.value !== undefined ? action.value : 0)]];
                break;

            case 'change_var':
                block.opcode = "data_changevariableby";
                const cVarName = action.name || "puntos";
                const cVarId = variablesMap[cVarName] || cVarName;
                block.fields.VARIABLE = [cVarName, cVarId];
                block.inputs.VALUE = [1, [4, String(action.by !== undefined ? action.by : 1)]];
                break;

            case 'ask':
                // Genera la pregunta interactiva con retroalimentación inmediata
                block.opcode = "sensing_askandwait";
                block.inputs.QUESTION = [1, [10, String(action.question || "¿Cuál es su respuesta?")]];
                break;

            default:
                Console.log(`Acción no reconocida omitida: ${action.type}`, 'warning');
                return null;
        }

        return { id, block };
    }

    async compileSemanticJson(inputJson) {
        Console.log("Transformando JSON semántico a estructura Scratch 3.0...", 'info');
        const project = JSON.parse(JSON.stringify(SCRATCH_TEMPLATE));
        this.zip = new JSZip();

        // 1. Configurar variables del proyecto
        const variablesMap = {};
        if (inputJson.variables && typeof inputJson.variables === 'object') {
            for (const [vName, vVal] of Object.entries(inputJson.variables)) {
                const vId = generateId('var_');
                variablesMap[vName] = vId;
                project.targets[0].variables[vId] = [vName, vVal];
            }
        }

        // 2. Configurar Fondo del Escenario (Stage Backdrop)
        if (inputJson.backdrop && inputJson.backdrop.url) {
            const backdropBlob = await this.fetchExternalImage(inputJson.backdrop.url);
            if (backdropBlob) {
                const assetId = generateId('bd_').toLowerCase();
                const ext = inputJson.backdrop.url.split('.').pop().split('?')[0] || 'jpg';
                const filename = `${assetId}.${ext}`;
                this.zip.file(filename, backdropBlob);
                project.targets[0].costumes[0] = {
                    name: inputJson.backdrop.name || "FondoPersonalizado",
                    dataFormat: ext,
                    assetId: assetId,
                    md5ext: filename,
                    rotationCenterX: 240,
                    rotationCenterY: 180
                };
                Console.log(`Fondo personalizado añadido: ${filename}`, 'success');
            }
        }

        // Incluir activo base de fondo si no se ha reemplazado o como respaldo
        const baseStageBg = await this.getAssetBlob('cd21514d0531fdffb22204e0ec5ed84a.svg');
        if (baseStageBg && !this.zip.file('cd21514d0531fdffb22204e0ec5ed84a.svg')) {
            this.zip.file('cd21514d0531fdffb22204e0ec5ed84a.svg', baseStageBg);
        }

        // 3. Crear el Sprite Principal
        const sprite = {
            isStage: false,
            name: "PersonajePrincipal",
            variables: {},
            lists: {},
            broadcasts: {},
            blocks: {},
            comments: {},
            currentCostume: 0,
            costumes: [],
            sounds: [
                {
                    name: "pop",
                    assetId: "83a9787d4cb6f3b7632b4ddfebf74367",
                    dataFormat: "wav",
                    format: "",
                    rate: 48000,
                    sampleCount: 1123,
                    md5ext: "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                },
                {
                    name: "meow",
                    assetId: "83c36d806dc92327b9e7049a565c6bff",
                    dataFormat: "wav",
                    format: "",
                    rate: 48000,
                    sampleCount: 40681,
                    md5ext: "83c36d806dc92327b9e7049a565c6bff.wav"
                }
            ],
            volume: 100,
            layerOrder: 1,
            visible: true,
            x: 0,
            y: 0,
            size: 100,
            direction: 90,
            draggable: false,
            rotationStyle: "all around"
        };

        // Procesar Disfraces del Sprite
        if (inputJson.costumes && Array.isArray(inputJson.costumes)) {
            for (const cost of inputJson.costumes) {
                let costName = typeof cost === 'string' ? cost : (cost.name || "Disfraz");
                let blob = null;
                let assetId = "";
                let filename = "";

                if (typeof cost === 'object' && cost.url) {
                    blob = await this.fetchExternalImage(cost.url);
                    if (blob) {
                        assetId = generateId('cost_').toLowerCase();
                        const ext = cost.url.split('.').pop().split('?')[0] || 'png';
                        filename = `${assetId}.${ext}`;
                    }
                }

                if (blob) {
                    this.zip.file(filename, blob);
                    sprite.costumes.push({
                        name: costName,
                        bitmapResolution: 1,
                        dataFormat: filename.split('.').pop(),
                        assetId: assetId,
                        md5ext: filename,
                        rotationCenterX: 50,
                        rotationCenterY: 50
                    });
                    Console.log(`Disfraz externo incorporado: ${costName}`, 'success');
                }
            }
        }

        // Si no se incluyeron disfraces externos válidos, usar el gato clásico de Scratch
        if (sprite.costumes.length === 0) {
            const cat1Blob = await this.getAssetBlob('bcf454acf82e4504149f7ffe07081dbc.svg');
            const cat2Blob = await this.getAssetBlob('0fb9be3e8397c983338cb71dc84d0b25.svg');

            if (cat1Blob) {
                this.zip.file('bcf454acf82e4504149f7ffe07081dbc.svg', cat1Blob);
                sprite.costumes.push({
                    name: "costume1",
                    bitmapResolution: 1,
                    dataFormat: "svg",
                    assetId: "bcf454acf82e4504149f7ffe07081dbc",
                    md5ext: "bcf454acf82e4504149f7ffe07081dbc.svg",
                    rotationCenterX: 48,
                    rotationCenterY: 50
                });
            }

            if (cat2Blob) {
                this.zip.file('0fb9be3e8397c983338cb71dc84d0b25.svg', cat2Blob);
                sprite.costumes.push({
                    name: "costume2",
                    bitmapResolution: 1,
                    dataFormat: "svg",
                    assetId: "0fb9be3e8397c983338cb71dc84d0b25",
                    md5ext: "0fb9be3e8397c983338cb71dc84d0b25.svg",
                    rotationCenterX: 46,
                    rotationCenterY: 53
                });
            }
        }

        // Añadir pistas de audio básicas al ZIP
        const popBlob = await this.getAssetBlob('83a9787d4cb6f3b7632b4ddfebf74367.wav');
        if (popBlob) this.zip.file('83a9787d4cb6f3b7632b4ddfebf74367.wav', popBlob);

        const meowBlob = await this.getAssetBlob('83c36d806dc92327b9e7049a565c6bff.wav');
        if (meowBlob) this.zip.file('83c36d806dc92327b9e7049a565c6bff.wav', meowBlob);

        // 4. Mapear y encadenar acciones a bloques Scratch
        if (inputJson.actions && Array.isArray(inputJson.actions)) {
            // Expandir acciones compuestas (como 'ask' con retroalimentación)
            const expandedActions = [];
            for (const act of inputJson.actions) {
                if (act.type === 'ask' && (act.correct_say || act.incorrect_say)) {
                    expandedActions.push({ type: 'ask', question: act.question });
                    if (act.correct_say) {
                        expandedActions.push({ type: 'say', text: act.correct_say, seconds: 3 });
                    }
                } else {
                    expandedActions.push(act);
                }
            }

            let lastId = null;
            const reversedActions = [...expandedActions].reverse();

            for (const action of reversedActions) {
                const res = this.mapActionToBlock(action, lastId, null, variablesMap);
                if (res) {
                    sprite.blocks[res.id] = res.block;
                    if (lastId) sprite.blocks[lastId].parent = res.id;
                    lastId = res.id;
                }
            }
        }

        project.targets.push(sprite);
        return project;
    }

    async generateSb3(jsonString) {
        Console.clear();
        Console.log("Iniciando proceso de compilación para Scratch 3.0...", 'info');

        let parsed;
        try {
            parsed = JSON.parse(jsonString);
        } catch (e) {
            Console.log(`Error de sintaxis JSON: ${e.message}`, 'error');
            throw e;
        }

        let projectJson;
        this.zip = new JSZip();

        // Detección automática del tipo de JSON
        if (parsed.targets && Array.isArray(parsed.targets)) {
            Console.log("Detectado formato nativo de Scratch 3.0 (project.json). Empaquetando activos base...", 'info');
            projectJson = parsed;

            // Incluir todos los recursos base de Scratch
            for (const assetName of this.baseAssetNames) {
                const blob = await this.getAssetBlob(assetName);
                if (blob) this.zip.file(assetName, blob);
            }
        } else if (parsed.actions && Array.isArray(parsed.actions)) {
            Console.log("Detectado formato semántico OKF (prompt-to-sb3).", 'info');
            projectJson = await this.compileSemanticJson(parsed);
        } else {
            throw new Error("El JSON proporcionado no cumple con la estructura de prompt-to-sb3 ni con el formato de Scratch 3.0.");
        }

        // Escribir el project.json compilado
        const jsonContent = JSON.stringify(projectJson, null, 2);
        this.zip.file("project.json", jsonContent);

        Console.log("Generando contenedor ZIP comprimido (.sb3)...", 'info');
        const zipBlob = await this.zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: { level: 6 }
        });

        const projectName = (parsed.name || "proyecto_scratch").replace(/[^a-zA-Z0-9_-]/g, '_');
        const filename = `${projectName}.sb3`;

        // Descarga automática en el navegador
        const downloadUrl = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);

        Console.log(`¡Proyecto compilado y descargado con éxito!: <strong>${filename}</strong>`, 'success');
        Console.log("Instrucciones para abrir: Vaya a <a href='https://scratch.mit.edu/projects/editor' target='_blank' style='color:#38bdf8;'>scratch.mit.edu</a>, haga clic en <em>Archivo > Subir desde tu ordenador</em> y seleccione su archivo.", 'info');
    }

    async inspectSb3(file) {
        Console.clear();
        Console.log(`Inspeccionando archivo: ${file.name}...`, 'info');
        try {
            const loadedZip = await JSZip.loadAsync(file);
            const projectJsonFile = loadedZip.file("project.json");
            if (!projectJsonFile) {
                Console.log("Error: El archivo .sb3 no contiene 'project.json'.", 'error');
                return;
            }
            const jsonText = await projectJsonFile.async("text");
            const data = JSON.parse(jsonText);

            Console.log(`Versión semver de Scratch: ${data.meta?.semver || '3.0.0'}`, 'info');
            Console.log(`Total de targets: ${data.targets?.length || 0}`, 'info');

            data.targets?.forEach((t, i) => {
                Console.log(`Target ${i}: ${t.name} (${t.isStage ? 'Escenario' : 'Sprite'}) - Bloques: ${Object.keys(t.blocks || {}).length}, Disfraces: ${t.costumes?.length || 0}`, 'info');
            });

            // Mostrar el JSON en el editor
            document.getElementById('json-input').value = JSON.stringify(data, null, 2);
            Console.log("Estructura de project.json cargada en el editor.", 'success');
        } catch (e) {
            Console.log(`Error al inspeccionar el archivo: ${e.message}`, 'error');
        }
    }
}

// Inicialización de la aplicación
const compiler = new ScratchCompiler();

// Activos embebidos para compatibilidad offline inmediata
EMBEDDED_ASSETS = window.EMBEDDED_SCRATCH_ASSETS || {};

// Event Listeners de la Interfaz
document.getElementById('compile-btn')?.addEventListener('click', async () => {
    const input = document.getElementById('json-input').value.trim();
    if (!input) {
        Console.log("Por favor, introduzca o pegue un JSON válido en el editor.", "error");
        return;
    }
    try {
        await compiler.generateSb3(input);
    } catch (e) {
        Console.log(`Error durante la compilación: ${e.message}`, "error");
    }
});

// Formatear JSON
document.getElementById('format-btn')?.addEventListener('click', () => {
    const input = document.getElementById('json-input').value.trim();
    if (!input) return;
    try {
        const obj = JSON.parse(input);
        document.getElementById('json-input').value = JSON.stringify(obj, null, 2);
        Console.log("JSON formateado correctamente.", "success");
    } catch (e) {
        Console.log("No se pudo formatear: el texto actual contiene errores de sintaxis JSON.", "error");
    }
});

// Limpiar editor
document.getElementById('clear-btn')?.addEventListener('click', () => {
    document.getElementById('json-input').value = '';
    Console.log("Editor limpiado.", "info");
});

// Selector de Ejemplos
document.getElementById('example-select')?.addEventListener('change', async (e) => {
    const val = e.target.value;
    if (!val) return;
    
    // 1. Intentar cargar desde ejemplos embebidos (instantáneo y sin restricciones CORS)
    if (window.EMBEDDED_EXAMPLES && window.EMBEDDED_EXAMPLES[val]) {
        document.getElementById('json-input').value = JSON.stringify(window.EMBEDDED_EXAMPLES[val], null, 2);
        Console.log(`Ejemplo cargado: ${val}`, 'success');
        return;
    }

    // 2. Fallback a fetch
    try {
        const resp = await fetch(`examples/${val}`);
        if (resp.ok) {
            const data = await resp.json();
            document.getElementById('json-input').value = JSON.stringify(data, null, 2);
            Console.log(`Ejemplo cargado: ${val}`, 'success');
        }
    } catch (err) {
        Console.log(`Error cargando ejemplo: ${err.message}`, 'error');
    }
});

// Función de Copia Rápida al Portapapeles
function copyText(elementId, btn) {
    const textEl = document.getElementById(elementId);
    if (!textEl) return;
    const text = textEl.textContent.trim();
    navigator.clipboard.writeText(text).then(() => {
        Console.log("Texto copiado al portapapeles.", "success");
        const original = btn.innerHTML;
        btn.innerHTML = `<i data-lucide="check" size="14"></i> ¡Copiado!`;
        if (window.lucide) lucide.createIcons();
        setTimeout(() => {
            btn.innerHTML = original;
            if (window.lucide) lucide.createIcons();
        }, 2000);
    }).catch(err => {
        Console.log("No se pudo copiar automáticamente: " + err, "error");
    });
}
window.copyText = copyText;

// Conectar botones rápidos de la cabecera
document.getElementById('copy-assets-prompt-quick')?.addEventListener('click', function() {
    copyText('assets-prompt-text', this);
});

document.getElementById('copy-master-quick')?.addEventListener('click', function() {
    copyText('master-prompt-text', this);
});

// Gestión del Modal de Guía
const modal = document.getElementById('guide-modal');
const openBtn = document.getElementById('open-guide');
const closeBtn = document.getElementById('close-guide');

if (openBtn && modal) openBtn.onclick = () => modal.style.display = 'flex';
if (closeBtn && modal) closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

// Carga de archivo .sb3 para inspección (Drag & Drop e Input)
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');

if (dropArea && fileInput) {
    dropArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) compiler.inspectSb3(e.target.files[0]);
    });
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('drag-active');
    });
    dropArea.addEventListener('dragleave', () => dropArea.classList.remove('drag-active'));
    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('drag-active');
        if (e.dataTransfer.files.length > 0) compiler.inspectSb3(e.dataTransfer.files[0]);
    });
}
