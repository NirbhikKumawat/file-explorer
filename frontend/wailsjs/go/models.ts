export namespace main {
	
	export class FileEntry {
	    name: string;
	    isDirectory: boolean;
	
	    static createFrom(source: any = {}) {
	        return new FileEntry(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.isDirectory = source["isDirectory"];
	    }
	}

}

