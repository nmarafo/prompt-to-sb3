/**
 * prompt-to-sb3 | Scratch 3.0 Universal Compiler Engine
 * Interpreta especificaciones JSON generales (Videojuegos, Visores, Animaciones, Herramientas) o project.json nativo y compila a .sb3
 * 
 * @author Norberto Martín Afonso (@nmarafo)
 * @license CC BY-SA 4.0
 */

// Consola de Estado
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

// Plantilla base estándar de Scratch 3.0
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
        vm: "0.2.0-universal.2026",
        agent: "prompt-to-sb3 Universal Compiler v3.0 (by @nmarafo)"
    }
};

let EMBEDDED_ASSETS = window.EMBEDDED_SCRATCH_ASSETS || {};

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
        // 1. Intentar carga vía fetch
        try {
            const resp = await fetch(`assets/${filename}`);
            if (resp.ok) return await resp.blob();
        } catch (e) {}

        // 2. Fallback a activos base64 embebidos
        if (EMBEDDED_ASSETS && EMBEDDED_ASSETS[filename]) {
            const ext = filename.split('.').pop();
            const mime = ext === 'svg' ? 'image/svg+xml' : (ext === 'wav' ? 'audio/wav' : 'application/octet-stream');
            return this.base64ToBlob(EMBEDDED_ASSETS[filename], mime);
        }

        return null;
    }

    async fetchExternalImage(url) {
        Console.log(`Descargando activo: ${url}...`, 'info');
        try {
            const resp = await fetch(url, { mode: 'cors' });
            if (resp.ok) return await resp.blob();
        } catch (err) {
            Console.log(`Intento directo no disponible (${err.message}). Conectando vía proxy CORS...`, 'warning');
        }

        try {
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
            const respProxy = await fetch(proxyUrl);
            if (respProxy.ok) {
                Console.log(`Descargado con éxito vía proxy CORS.`, 'success');
                return await respProxy.blob();
            }
        } catch (err2) {
            Console.log(`No se pudo descargar ${url}. Se empleará el activo predeterminado.`, 'warning');
        }

        return null;
    }

    buildActionBlock(action, nextId, parentId, variablesMap, blocksCollector) {
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

        const type = (action.type || '').toLowerCase().replace(/[\s-]/g, '_');

        switch (type) {
            // === EVENTOS ===
            case 'start':
            case 'flag':
            case 'when_flag_clicked':
            case 'when_flag':
            case 'flag_clicked':
            case 'green_flag':
            case 'on_start':
                block.opcode = "event_whenflagclicked";
                block.x = action.x || 100;
                block.y = action.y || 100;
                break;

            case 'when_key':
            case 'when_key_pressed':
            case 'key_pressed':
            case 'key':
            case 'on_key':
                block.opcode = "event_whenkeypressed";
                block.fields.KEY_OPTION = [String(action.key || action.key_name || "space"), null];
                block.x = action.x || 100;
                block.y = action.y || 100;
                break;

            case 'when_clicked':
            case 'click':
            case 'when_this_sprite_clicked':
            case 'when_sprite_clicked':
            case 'this_sprite_clicked':
            case 'sprite_clicked':
            case 'on_click':
                block.opcode = "event_whenthisspriteclicked";
                block.x = action.x || 100;
                block.y = action.y || 100;
                break;

            case 'broadcast':
            case 'broadcast_message':
            case 'send_broadcast':
                block.opcode = "event_broadcast";
                const bMsg = String(action.message || action.msg || action.broadcast || "mensaje1");
                block.inputs.BROADCAST_INPUT = [1, [11, bMsg, generateId('bc_')]];
                break;

            case 'when_receive':
            case 'receive':
            case 'when_broadcast_received':
            case 'broadcast_received':
            case 'on_broadcast':
            case 'on_receive':
            case 'on_message':
                block.opcode = "event_whenbroadcastreceived";
                const rMsg = String(action.message || action.msg || action.broadcast || "mensaje1");
                block.fields.BROADCAST_OPTION = [rMsg, generateId('bc_')];
                block.x = action.x || 100;
                block.y = action.y || 100;
                break;

            // === MOVIMIENTO (JUEGOS Y VISORES) ===
            case 'move':
            case 'go_to':
            case 'goto':
            case 'go_to_xy':
            case 'gotoxy':
            case 'set_position':
            case 'position':
            case 'move_to':
                if (action.x !== undefined || action.y !== undefined) {
                    block.opcode = "motion_gotoxy";
                    block.inputs.X = [1, [4, String(action.x || 0)]];
                    block.inputs.Y = [1, [4, String(action.y || 0)]];
                } else {
                    block.opcode = "motion_movesteps";
                    block.inputs.STEPS = [1, [4, String(action.steps || action.val || 10)]];
                }
                break;

            case 'changex':
            case 'change_x':
            case 'change_x_by':
                block.opcode = "motion_changexby";
                const dxVal = action.dx !== undefined ? action.dx : (action.val !== undefined ? action.val : (action.by !== undefined ? action.by : 10));
                block.inputs.DX = [1, [4, String(dxVal)]];
                break;

            case 'changey':
            case 'change_y':
            case 'change_y_by':
                block.opcode = "motion_changeyby";
                const dyVal = action.dy !== undefined ? action.dy : (action.val !== undefined ? action.val : (action.by !== undefined ? action.by : 10));
                block.inputs.DY = [1, [4, String(dyVal)]];
                break;

            case 'setx':
            case 'set_x':
            case 'set_x_to':
                block.opcode = "motion_setx";
                block.inputs.X = [1, [4, String(action.x !== undefined ? action.x : (action.val || 0))]];
                break;

            case 'sety':
            case 'set_y':
            case 'set_y_to':
                block.opcode = "motion_sety";
                block.inputs.Y = [1, [4, String(action.y !== undefined ? action.y : (action.val || 0))]];
                break;

            case 'turn_right':
            case 'turnright':
            case 'rotate_right':
                block.opcode = "motion_turnright";
                block.inputs.DEGREES = [1, [4, String(action.degrees || action.val || 15)]];
                break;

            case 'turn_left':
            case 'turnleft':
            case 'rotate_left':
                block.opcode = "motion_turnleft";
                block.inputs.DEGREES = [1, [4, String(action.degrees || action.val || 15)]];
                break;

            case 'point_direction':
            case 'point_in_direction':
                block.opcode = "motion_pointindirection";
                block.inputs.DIRECTION = [1, [8, String(action.direction !== undefined ? action.direction : (action.val !== undefined ? action.val : 90))]];
                break;

            case 'bounce_edge':
            case 'bounce':
            case 'if_on_edge_bounce':
            case 'bounce_on_edge':
                block.opcode = "motion_ifonedgebounce";
                break;

            case 'glide':
            case 'glide_to':
                block.opcode = "motion_glidesecstoxy";
                block.inputs.SECS = [1, [4, String(action.seconds || action.duration || action.time || 1)]];
                block.inputs.X = [1, [4, String(action.x || 0)]];
                block.inputs.Y = [1, [4, String(action.y || 0)]];
                break;

            // === APARIENCIA (VISORES, ANIMACIONES Y JUEGOS) ===
            case 'say':
            case 'say_for_secs':
            case 'speak':
                const sayDuration = action.seconds || action.duration || action.time;
                if (sayDuration) {
                    block.opcode = "looks_sayforsecs";
                    block.inputs.MESSAGE = [1, [10, String(action.text || action.msg || "")]];
                    block.inputs.SECS = [1, [4, String(sayDuration)]];
                } else {
                    block.opcode = "looks_say";
                    block.inputs.MESSAGE = [1, [10, String(action.text || action.msg || "")]];
                }
                break;

            case 'think':
            case 'think_for_secs':
                const thinkDuration = action.seconds || action.duration || action.time;
                if (thinkDuration) {
                    block.opcode = "looks_thinkforsecs";
                    block.inputs.MESSAGE = [1, [10, String(action.text || action.msg || "")]];
                    block.inputs.SECS = [1, [4, String(thinkDuration)]];
                } else {
                    block.opcode = "looks_think";
                    block.inputs.MESSAGE = [1, [10, String(action.text || action.msg || "")]];
                }
                break;

            case 'show':
            case 'appear':
                block.opcode = "looks_show";
                break;

            case 'hide':
            case 'disappear':
                block.opcode = "looks_hide";
                break;

            case 'costume':
            case 'switch_costume':
            case 'switch_costume_to':
                block.opcode = "looks_switchcostumeto";
                block.inputs.COSTUME = [1, [10, String(action.name || action.costume || "costume1")]];
                break;

            case 'next_costume':
                block.opcode = "looks_nextcostume";
                break;

            case 'backdrop':
            case 'switch_backdrop':
            case 'switch_backdrop_to':
                block.opcode = "looks_switchbackdropto";
                block.inputs.BACKDROP = [1, [10, String(action.name || action.backdrop || "backdrop1")]];
                break;

            case 'next_backdrop':
                block.opcode = "looks_nextbackdrop";
                break;

            case 'set_size':
            case 'set_size_to':
                block.opcode = "looks_setsizeto";
                block.inputs.SIZE = [1, [4, String(action.size || action.val || 100)]];
                break;

            case 'change_size':
            case 'change_size_by':
                block.opcode = "looks_changesizeby";
                block.inputs.CHANGE = [1, [4, String(action.by || action.val || 10)]];
                break;

            // === CONTROL (BUCLES DE JUEGO, TEMPORIZADORES Y CONDICIONALES) ===
            case 'wait':
            case 'sleep':
            case 'pause':
            case 'delay':
                block.opcode = "control_wait";
                block.inputs.DURATION = [1, [5, String(action.seconds || action.duration || action.time || action.val || 1)]];
                break;

            case 'forever':
            case 'loop':
            case 'repeat_forever':
                block.opcode = "control_forever";
                if (action.actions && Array.isArray(action.actions)) {
                    const subFirstId = this.compileActionsList(action.actions, id, variablesMap, blocksCollector);
                    if (subFirstId) {
                        block.inputs.SUBSTACK = [2, subFirstId];
                    }
                }
                break;

            case 'repeat':
            case 'repeat_times':
            case 'loop_times':
                block.opcode = "control_repeat";
                block.inputs.TIMES = [1, [6, String(action.times || action.count || 10)]];
                if (action.actions && Array.isArray(action.actions)) {
                    const subFirstId = this.compileActionsList(action.actions, id, variablesMap, blocksCollector);
                    if (subFirstId) {
                        block.inputs.SUBSTACK = [2, subFirstId];
                    }
                }
                break;

            // === SENSORES Y PREGUNTAS ===
            case 'ask':
            case 'question':
            case 'ask_and_wait':
                block.opcode = "sensing_askandwait";
                block.inputs.QUESTION = [1, [10, String(action.question || "¿Cuál es su respuesta?")]];
                break;

            // === SONIDOS ===
            case 'playsound':
            case 'play_sound':
            case 'sound':
            case 'start_sound':
                block.opcode = "sound_playuntildone";
                block.inputs.SOUND_MENU = [1, [10, String(action.name || action.sound || "pop")]];
                break;

            // === VARIABLES Y MARCADORES ===
            case 'set_var':
            case 'set_variable':
            case 'setvariable':
                block.opcode = "data_setvariableto";
                const sVarName = action.variable || action.name || action.var || "puntos";
                if (!variablesMap[sVarName]) {
                    variablesMap[sVarName] = generateId('var_');
                }
                const sVarId = variablesMap[sVarName];
                const sVal = action.val !== undefined ? action.val : (action.value !== undefined ? action.value : (action.to !== undefined ? action.to : 0));
                block.fields.VARIABLE = [sVarName, sVarId];
                block.inputs.VALUE = [1, [10, String(sVal)]];
                break;

            case 'change_var':
            case 'change_variable':
            case 'changevariable':
            case 'add_variable':
                block.opcode = "data_changevariableby";
                const cVarName = action.variable || action.name || action.var || "puntos";
                if (!variablesMap[cVarName]) {
                    variablesMap[cVarName] = generateId('var_');
                }
                const cVarId = variablesMap[cVarName];
                const cVal = action.val !== undefined ? action.val : (action.by !== undefined ? action.by : (action.value !== undefined ? action.value : 1));
                block.fields.VARIABLE = [cVarName, cVarId];
                block.inputs.VALUE = [1, [4, String(cVal)]];
                break;

            default:
                Console.log(`Acción no reconocida omitida: ${action.type}`, 'warning');
                return null;
        }

        return { id, block };
    }

    compileActionsList(actionsList, parentId, variablesMap, blocksCollector) {
        if (!actionsList || !Array.isArray(actionsList) || actionsList.length === 0) return null;

        let lastId = null;
        const reversed = [...actionsList].reverse();

        for (let i = 0; i < reversed.length; i++) {
            const act = reversed[i];
            const isFirstInStack = (i === reversed.length - 1);
            const currentParentId = isFirstInStack ? parentId : null;

            const res = this.buildActionBlock(act, lastId, currentParentId, variablesMap, blocksCollector);
            if (res) {
                blocksCollector[res.id] = res.block;
                if (lastId && blocksCollector[lastId]) {
                    blocksCollector[lastId].parent = res.id;
                }
                lastId = res.id;
            }
        }

        return lastId; // Retorna el primer bloque de la pila
    }

    async processSpriteCostumes(sprite, costumesData) {
        if (costumesData && Array.isArray(costumesData)) {
            for (const cost of costumesData) {
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
                        rotationCenterX: 48,
                        rotationCenterY: 50
                    });
                    Console.log(`Disfraz incorporado a [${sprite.name}]: ${costName}`, 'success');
                }
            }
        }

        // Si no tiene disfraces válidos, aplicar disfraces clásicos
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
    }

    async compileGeneralJson(inputJson) {
        Console.log("Procesando especificación JSON universal para Scratch 3.0...", 'info');
        const project = JSON.parse(JSON.stringify(SCRATCH_TEMPLATE));
        this.zip = new JSZip();

        // 1. Configurar variables (puntos, vidas, nivel, indice, etc.)
        const variablesMap = {};
        if (inputJson.variables && typeof inputJson.variables === 'object') {
            for (const [vName, vVal] of Object.entries(inputJson.variables)) {
                const vId = generateId('var_');
                variablesMap[vName] = vId;
                project.targets[0].variables[vId] = [vName, vVal];
            }
        }

        // 2. Fondos del Escenario (Stage Backdrops: soporta 'backdrop' y 'backdrops')
        const rawBackdrops = [];
        if (inputJson.backdrops && Array.isArray(inputJson.backdrops)) {
            rawBackdrops.push(...inputJson.backdrops);
        }
        if (inputJson.backdrop) {
            if (Array.isArray(inputJson.backdrop)) rawBackdrops.push(...inputJson.backdrop);
            else rawBackdrops.push(inputJson.backdrop);
        }

        // Deduplicar fondos por URL o por nombre
        const seenBds = new Set();
        const backdropsList = [];
        for (const bd of rawBackdrops) {
            const key = (bd && (bd.url || bd.name)) || '';
            if (key && !seenBds.has(key)) {
                seenBds.add(key);
                backdropsList.push(bd);
            }
        }

        if (backdropsList.length > 0) {
            let isFirst = true;
            for (const bd of backdropsList) {
                if (bd.url) {
                    const bdBlob = await this.fetchExternalImage(bd.url);
                    if (bdBlob) {
                        const assetId = generateId('bd_').toLowerCase();
                        const ext = bd.url.split('.').pop().split('?')[0] || 'jpg';
                        const filename = `${assetId}.${ext}`;
                        this.zip.file(filename, bdBlob);

                        const bdObj = {
                            name: bd.name || "FondoPersonalizado",
                            dataFormat: ext,
                            assetId: assetId,
                            md5ext: filename,
                            rotationCenterX: 240,
                            rotationCenterY: 180
                        };

                        if (isFirst) {
                            project.targets[0].costumes[0] = bdObj;
                            isFirst = false;
                        } else {
                            project.targets[0].costumes.push(bdObj);
                        }
                        Console.log(`Fondo añadido: ${bdObj.name}`, 'success');
                    }
                }
            }
        }

        // Activo neutro de respaldo para el escenario
        const baseBg = await this.getAssetBlob('cd21514d0531fdffb22204e0ec5ed84a.svg');
        if (baseBg && !this.zip.file('cd21514d0531fdffb22204e0ec5ed84a.svg')) {
            this.zip.file('cd21514d0531fdffb22204e0ec5ed84a.svg', baseBg);
        }

        // 3. Procesar Sprites (Soporte Multi-Sprite o Sprite Único)
        let spritesDefs = [];
        if (inputJson.sprites && Array.isArray(inputJson.sprites)) {
            spritesDefs = inputJson.sprites;
        } else {
            // Modo Sprite Único / Compatibilidad directa
            spritesDefs = [{
                name: inputJson.sprite_name || "ObjetoPrincipal",
                costumes: inputJson.costumes,
                actions: inputJson.actions,
                scripts: inputJson.scripts,
                x: inputJson.x || 0,
                y: inputJson.y || 0
            }];
        }

        let layer = 1;
        for (const sDef of spritesDefs) {
            const sprite = {
                isStage: false,
                name: sDef.name || `Objeto${layer}`,
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
                layerOrder: layer++,
                visible: sDef.visible !== false,
                x: sDef.x || 0,
                y: sDef.y || 0,
                size: sDef.size || 100,
                direction: sDef.direction !== undefined ? sDef.direction : 90,
                draggable: false,
                rotationStyle: sDef.rotationStyle || "all around"
            };

            await this.processSpriteCostumes(sprite, sDef.costumes);

            // Mapeo de Bloques: Múltiples scripts independientes o array de acciones
            if (sDef.scripts && Array.isArray(sDef.scripts)) {
                let scriptOffsetY = 100;
                for (const script of sDef.scripts) {
                    const acts = Array.isArray(script) ? script : (script.actions || []);
                    if (acts.length > 0) {
                        const firstAct = acts[0];
                        if (firstAct && firstAct.x === undefined) firstAct.x = 100;
                        if (firstAct && firstAct.y === undefined) firstAct.y = scriptOffsetY;
                        this.compileActionsList(acts, null, variablesMap, sprite.blocks);
                        scriptOffsetY += 160;
                    }
                }
            } else if (sDef.actions && Array.isArray(sDef.actions)) {
                this.compileActionsList(sDef.actions, null, variablesMap, sprite.blocks);
            }

            project.targets.push(sprite);
        }

        // Sincronizar variables dinámicas descubiertas en acciones con el Stage
        for (const [vName, vId] of Object.entries(variablesMap)) {
            if (!project.targets[0].variables[vId]) {
                project.targets[0].variables[vId] = [vName, 0];
            }
        }

        // Pistas de audio base al ZIP
        const popBlob = await this.getAssetBlob('83a9787d4cb6f3b7632b4ddfebf74367.wav');
        if (popBlob) this.zip.file('83a9787d4cb6f3b7632b4ddfebf74367.wav', popBlob);

        const meowBlob = await this.getAssetBlob('83c36d806dc92327b9e7049a565c6bff.wav');
        if (meowBlob) this.zip.file('83c36d806dc92327b9e7049a565c6bff.wav', meowBlob);

        return project;
    }

    async generateSb3(jsonString) {
        Console.clear();
        Console.log("Iniciando compilador de proyectos Scratch 3.0...", 'info');

        let parsed;
        try {
            parsed = JSON.parse(jsonString);
        } catch (e) {
            Console.log(`Error de sintaxis JSON: ${e.message}`, 'error');
            throw e;
        }

        let projectJson;
        this.zip = new JSZip();

        if (parsed.targets && Array.isArray(parsed.targets)) {
            Console.log("Detectado formato nativo de Scratch 3.0 (project.json). Empaquetando recursos...", 'info');
            projectJson = parsed;

            for (const assetName of this.baseAssetNames) {
                const blob = await this.getAssetBlob(assetName);
                if (blob) this.zip.file(assetName, blob);
            }
        } else if (parsed.actions || parsed.sprites) {
            Console.log(`Compilando proyecto [${parsed.type || parsed.category || 'general'}]...`, 'info');
            projectJson = await this.compileGeneralJson(parsed);
        } else {
            throw new Error("El JSON no contiene 'actions', 'sprites' ni 'targets'. Verifique la estructura.");
        }

        const jsonContent = JSON.stringify(projectJson, null, 2);
        this.zip.file("project.json", jsonContent);

        Console.log("Comprimiendo contenedor .sb3 (ZIP)...", 'info');
        const zipBlob = await this.zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: { level: 6 }
        });

        const projectName = (parsed.name || "proyecto_scratch").replace(/[^a-zA-Z0-9_-]/g, '_');
        const filename = `${projectName}.sb3`;

        const downloadUrl = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);

        Console.log(`¡Archivo descargado con éxito!: <strong>${filename}</strong>`, 'success');
        Console.log("Para ejecutar: Acceda a <a href='https://scratch.mit.edu/projects/editor' target='_blank' style='color:#38bdf8;'>scratch.mit.edu</a> > <em>Archivo > Subir desde tu ordenador</em>.", 'info');
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
            Console.log(`Total de elementos (Targets): ${data.targets?.length || 0}`, 'info');

            data.targets?.forEach((t, i) => {
                Console.log(`- Target ${i}: ${t.name} (${t.isStage ? 'Escenario' : 'Sprite'}) | Bloques: ${Object.keys(t.blocks || {}).length} | Disfraces: ${t.costumes?.length || 0}`, 'info');
            });

            document.getElementById('json-input').value = JSON.stringify(data, null, 2);
            Console.log("project.json cargado en el editor.", 'success');
        } catch (e) {
            Console.log(`Error al inspeccionar el archivo: ${e.message}`, 'error');
        }
    }
}

// Inicialización de la aplicación
const compiler = new ScratchCompiler();

// Listeners
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

document.getElementById('format-btn')?.addEventListener('click', () => {
    const input = document.getElementById('json-input').value.trim();
    if (!input) return;
    try {
        const obj = JSON.parse(input);
        document.getElementById('json-input').value = JSON.stringify(obj, null, 2);
        Console.log("JSON formateado correctamente.", "success");
    } catch (e) {
        Console.log("No se pudo formatear: el texto contiene errores de sintaxis JSON.", "error");
    }
});

document.getElementById('clear-btn')?.addEventListener('click', () => {
    document.getElementById('json-input').value = '';
    Console.log("Editor limpiado.", "info");
});

document.getElementById('example-select')?.addEventListener('change', async (e) => {
    const val = e.target.value;
    if (!val) return;
    
    if (window.EMBEDDED_EXAMPLES && window.EMBEDDED_EXAMPLES[val]) {
        document.getElementById('json-input').value = JSON.stringify(window.EMBEDDED_EXAMPLES[val], null, 2);
        Console.log(`Ejemplo cargado: ${val}`, 'success');
        return;
    }

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
        Console.log("No se pudo copiar: " + err, "error");
    });
}
window.copyText = copyText;

document.getElementById('copy-assets-prompt-quick')?.addEventListener('click', function() {
    copyText('assets-prompt-text', this);
});

document.getElementById('copy-master-quick')?.addEventListener('click', function() {
    copyText('master-prompt-text', this);
});

const modal = document.getElementById('guide-modal');
const openBtn = document.getElementById('open-guide');
const closeBtn = document.getElementById('close-guide');

if (openBtn && modal) openBtn.onclick = () => modal.style.display = 'flex';
if (closeBtn && modal) closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

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
