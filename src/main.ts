import {
	Editor,
	MarkdownView,
	MarkdownFileInfo,
	Modal,
	Notice,
	Plugin,
	requestUrl,
	TFile,
} from 'obsidian';
import {
	DEFAULT_SETTINGS,
	HevySyncSettings,
	SampleSettingTab,
} from './settings';
import { fetchHevyWorkouts } from './hevyApi';
import { formatWorkout } from './format';

// Remember to rename these classes and interfaces!
export default class HevySync extends Plugin {
	settings!: HevySyncSettings;

	async onload() {
		await this.loadSettings();

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status bar text');
		
		// call for data from hevy api
		this.addCommand({
			id: 'get-data-from-hevy',
			name: 'Get data from hevy',
			callback: async () => {
				try{
					const data = await fetchHevyWorkouts(this.settings.secretKey);
					const folderPath = this.settings.workoutsFolder;
					const existingFolder = this.app.vault.getAbstractFileByPath(folderPath);

					if (!existingFolder) {
						await this.app.vault.createFolder(folderPath);
					}
					for (const workout of data.workouts) {
						if (!workout) {
							new Notice('Brak treningów do wyświetlenia');
							return;
						}
						const markdown = formatWorkout(workout);
						
						// czy sciezka do pliku istnieje
						const path = `${this.settings.workoutsFolder}/${workout.id}.md`;
						const existingFile = this.app.vault.getAbstractFileByPath(path);
						if (existingFile instanceof TFile) {
							await this.app.vault.modify(existingFile, markdown);
						} else {
							await this.app.vault.create(path, markdown);
						}
						new Notice('Zapisano trening');
					}
				} catch (error: unknown) {
					new Notice(`Błąd podczas pobierania danych z Hevy: ${ (error as Error).message }`);
					console.error(error);
				}
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<HevySyncSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}