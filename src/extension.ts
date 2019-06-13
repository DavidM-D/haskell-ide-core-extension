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
	let cPath: string | undefined = config.get("executionPath");
	if(cPath === "" || cPath === undefined){
		window.showErrorMessage("You must specify a hic.executionPath in config");
		return;
	}
	let serverModule = context.asAbsolutePath(cPath);
	let debugOptions = {}; //

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	let serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	};

	// Options to control the language client
	let clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: ["haskell"]
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'haskell-ide-core',
		'Haskell IDE Core',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}