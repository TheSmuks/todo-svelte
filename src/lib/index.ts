// place files you want to import through the `$lib` alias in this folder.
const Status = [
	'All',
	'Pending',
	'Finished'
];

interface Task {
	id: string,
	name: string,
	status: number
}

export { Status };
export type { Task };
