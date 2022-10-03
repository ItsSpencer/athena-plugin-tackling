import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { TacklingSystem } from './src/system';


const PLUGIN_NAME = 'Tackling';
PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    TacklingSystem.init();

    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded!`);
});
