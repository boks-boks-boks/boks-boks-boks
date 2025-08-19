import { writable } from "svelte/store";
import { type LabelModel } from "$lib";

export const userLabels = writable<LabelModel[] | null>(null);

export function setLabels(labels: LabelModel[]): void {
    userLabels.set(labels);
}