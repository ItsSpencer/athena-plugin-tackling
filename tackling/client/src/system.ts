import * as alt from 'alt-client';
import { TACKLING_INTERACTIONS } from '../../shared/events';
import { TACKLING_CONFIG } from '../../shared/config';
import { KeybindController } from '../../../../client/events/keyup';
import { KEY_BINDS } from '../../shared/keyBinds';

class Logger {
    static log(msg: string) {
        if (TACKLING_CONFIG.LOGGING) {
            alt.log(msg);
        }
    }
}

class TacklingSystem {
    static init() {
        Logger.log("Tackling initialized.");
        KeybindController.registerKeybind({ key: KEY_BINDS.TACKLING, singlePress: TacklingSystem.tackle });
    }

    static tackle() {
        if (alt.Player.local.moveSpeed >= 3) {
            alt.emitServer(TACKLING_INTERACTIONS.DO_TACKLE);
        }
    }


}

TacklingSystem.init();