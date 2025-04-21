export default class StorageService {
	private storage: Storage

	constructor(storage: Storage = localStorage) {
		this.storage = storage
	}

	setItem(key: string, value: any): void {
		try {
			const serializedValue = JSON.stringify(value)
			this.storage.setItem(key, serializedValue)
		} catch (error) {
			console.error('Error saving to storage:', error)
		}
	}

	getItem<T>(key: string): T | null {
		try {
			const serializedValue = this.storage.getItem(key)
			return serializedValue ? (JSON.parse(serializedValue) as T) : null
		} catch (error) {
			console.error('Error reading from storage:', error)
			return null
		}
	}

	removeItem(key: string): void {
		try {
			this.storage.removeItem(key)
		} catch (error) {
			console.error('Error removing from storage:', error)
		}
	}

	clear(): void {
		try {
			this.storage.clear()
		} catch (error) {
			console.error('Error clearing storage:', error)
		}
	}
}
