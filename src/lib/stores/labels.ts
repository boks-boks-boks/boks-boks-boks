import { writable } from "svelte/store";
import { type LabelModel } from "$lib";

export const userLabels = writable<LabelModel[] | null>(null);

userLabels.subscribe(s => console.log(JSON.parse(JSON.stringify(s))))

export function setLabels(labels: LabelModel[]): void {
    userLabels.set(labels);
}