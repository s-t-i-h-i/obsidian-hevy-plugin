import { App, PluginSettingTab, Setting } from 'obsidian';
import HevySync from './main';

export interface HevySyncSettings {
	secretKey: string;
	workoutsFolder: string;
	defaultBodyweight: number;
}

export const DEFAULT_SETTINGS: HevySyncSettings = {
	secretKey: '',
	workoutsFolder: 'Hevy',
	defaultBodyweight: 81,
};

export class SampleSettingTab extends PluginSettingTab {
	plugin: HevySync;

	constructor(app: App, plugin: HevySync) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		// API key from hevy
		new Setting(containerEl)
			.setName('Secret key')
			.setDesc('Your API secret key')
			.addText((text) => {
				text.inputEl.type = 'password';
				text
					.setPlaceholder('Enter secret key')
					.setValue(this.plugin.settings.secretKey)
					.onChange(async (value) => {
						this.plugin.settings.secretKey = value;
						await this.plugin.saveSettings();
					});
			});
		
		// Folder for storing workouts
		new Setting(containerEl)
			.setName('Workouts folder')
			.setDesc('Folder for storing workouts')
			.addText((text) => {
				text
					.setPlaceholder('Enter folder name')
					.setValue(this.plugin.settings.workoutsFolder)
					.onChange(async (value) => {
						this.plugin.settings.workoutsFolder = value;
						await this.plugin.saveSettings();
					});
			});
		
		new Setting(containerEl)
			.setName('Default bodyweight (kg)')
			.setDesc('Used for bodyweight exercises when calculating total volume')
			.addText((text) => {
				text
					.setPlaceholder('e.g. 81')
					.setValue(this.plugin.settings.defaultBodyweight.toString())
					.onChange(async (value) => {
						const num = Number(value);
						this.plugin.settings.defaultBodyweight = isNaN(num) ? 81 : num;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName('Full sync')
			.setDesc('Sync all workouts')
			.addButton((button) => {
				button
            .setButtonText('Sync now')
            .onClick(async () => {
                await this.plugin.syncWorkouts();
            });
    	});
	}
}
