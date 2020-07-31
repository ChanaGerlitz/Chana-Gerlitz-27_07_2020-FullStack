import { MetaData } from './MetaData.model';

export class Result {
    data: string;
    metaData: MetaData;
    constructor(data: string, metaData: MetaData) {
        this.data = data;
        this.metaData = metaData;
    }
}