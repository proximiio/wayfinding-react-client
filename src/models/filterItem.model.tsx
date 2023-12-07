export interface FilterItemModel {
	title: string;
	icon?: string;
	iconImage?: string;
	id: string | string[];
	type: 'list' | 'closest'
}
