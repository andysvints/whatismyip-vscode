// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import axios from 'axios';

let PublicIPStatusBarItem: vscode.StatusBarItem;
let PublicIP: string;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// create a new status bar item that we can now manage
	PublicIPStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	
	//get public IP
	getPublicIP();

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('whatismyip.whatismyip', () => {
		getPublicIP();
	});

	
	context.subscriptions.push(disposable,PublicIPStatusBarItem);
}

// This method is called when your extension is deactivated
export function deactivate() {}


async function getPublicIP():Promise<void>{
	try {
		const response = await axios.get('https://api.ipify.org?format=json');
		PublicIP=response.data.ip;
		const IPInfoResponse=await axios.get(`https://ipinfo.io/${PublicIP}/json`);
		let IPDetails=IPInfoResponse.data;
		let text=`$(globe) IP: ${PublicIP} (${IPDetails.city},${IPDetails.country})`;
		PublicIPStatusBarItem.text=text;
		PublicIPStatusBarItem.show();
		vscode.window.showInformationMessage(`Your Public IP: ${PublicIP}`);
	} catch (error) {
		vscode.window.showErrorMessage(`Error: ${error}`);
	}
}