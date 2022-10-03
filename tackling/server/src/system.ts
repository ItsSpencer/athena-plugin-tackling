import * as alt from 'alt-server';
import Database from '@stuyk/ezmongodb';
import { PlayerEvents } from '../../../../server/events/playerEvents';
import { ATHENA_EVENTS_PLAYER } from '../../../../shared/enums/athenaEvents';
import { SYSTEM_EVENTS } from '../../../../shared/enums/system';
import { Athena } from '../../../../server/api/athena';
import { iPhone } from '../../../core-phone/shared/interfaces/Phone';
import { Character } from '../../../../shared/interfaces/character';
import { TACKLING_INTERACTIONS } from '../../shared/events';
import { TACKLING_CONFIG } from '../../shared/config';
import { ANIMATION_FLAGS } from '../../../../shared/flags/animationFlags';


class Logger {
    static log(msg: string) {
        if (TACKLING_CONFIG.LOGGING) {
            alt.log(msg);
        }
    }
}

export class TacklingSystem {
    /**
     * Initializes the Event Handlers
     *
     * @static
     * @memberof TacklingSystem
     */
    static init() {
        Logger.log("TacklingSystem initialized.");
        alt.onClient(TACKLING_INTERACTIONS.DO_TACKLE, TacklingSystem.tackle);
    }

    static async tackle(player: alt.Player) {
        if (player.moveSpeed >= 3) {
            let target: alt.Player = Athena.player.get.closestPlayer(player);
            if (target === undefined) {
                Logger.log("Player " + player.data.name + " tries to tackle, but nobody is nearby ");
                return;
            }

            if (player.pos.distanceTo(target.pos) > 3) {
                Logger.log("Player " + player.data.name + " tries to tackle " + target.data.name + ", but he is too far away...");
            }

            Logger.log("Player " + player.data.name + " tackles " + target.data.name);

            Athena.player.safe.setPosition(player, player.pos.x, player.pos.y, player.pos.z);
            Athena.player.set.frozen(player, true);
            Athena.player.safe.setPosition(target, target.pos.x, target.pos.y, target.pos.z);
            Athena.player.set.frozen(target, true);

            Athena.player.emit.animation(
                player,
                "melee@large_wpn@streamed_core",
                "ground_attack_on_spot",
                ANIMATION_FLAGS.REPEAT,
                3000
            );

            Athena.player.emit.animation(
                target,
                "missfbi5ig_0",
                "lyinginpain_loop_steve",
                ANIMATION_FLAGS.REPEAT,
                3000
            );

            alt.setTimeout(async () => {
                Athena.player.set.frozen(player, false);
                Athena.player.set.frozen(target, false);
            }, 3000);
        }
    }

}