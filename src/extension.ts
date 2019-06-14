import * as path from 'path';
import { workspace, ExtensionContext, window } from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
	let config = workspace.getConfiguration("hic");
	let cPath: string = config.get("executablePath") as string;
	if(cPath === "" || cPath === undefined){
		window.showErrorMessage("You must specify a hic.executionPath in config");
		return;
	}
	let command = cPath; //context.asAbsolutePath(cPath);
	let args : string[] = [config.get("arguments") as string];

	let clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: ["haskell"]
	};

	let client2 = new LanguageClient( 
		'haskell-ide-core',
		'Haskell IDE Core',
		{ args: args, command: command, options: {cwd: workspace.rootPath }}, clientOptions, true);
	
	client2.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}