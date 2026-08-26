import { Extension } from "@tiptap/core";

/**
 * Tab / Shift-Tab in Edit mode:
 * - nested list indent / outdent when inside a list
 * - otherwise insert two spaces (and keep focus in the editor)
 * - leave Table cell navigation to the table extension
 */
export const TabIndent = Extension.create({
  name: "tabIndent",
  priority: 50,

  addKeyboardShortcuts() {
    return {
      Tab: () => {
        if (this.editor.isActive("table")) {
          return false;
        }
        if (this.editor.commands.sinkListItem("listItem")) {
          return true;
        }
        return this.editor.commands.insertContent("  ");
      },
      "Shift-Tab": () => {
        if (this.editor.isActive("table")) {
          return false;
        }
        if (this.editor.commands.liftListItem("listItem")) {
          return true;
        }
        // Keep focus inside the editor instead of moving to the previous control.
        return true;
      },
    };
  },
});
