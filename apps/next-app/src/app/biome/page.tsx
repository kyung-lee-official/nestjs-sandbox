import React from "react";

const Page = () => {
  return (
    <div className="text-4xl bg-amber-300">
      <h1>Shift Alt F to format</h1>
      <p className="bg-blue-300">
		To enable format on save, add the following to your keybindings.json:
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
          <code>
            {`{
				"key": "shift+alt+f", 
				"command": "runCommands",
				"args": {
					"commands": ["editor.action.formatDocument", "editor.action.fixAll"]
				},
				"when": "editorTextFocus && !editorReadonly"
				}`}
          </code>
        </pre>
      </p>
    </div>
  );
};

export default Page;
