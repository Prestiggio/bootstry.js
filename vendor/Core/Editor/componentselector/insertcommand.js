// simplebox/insertsimpleboxcommand.js

import Command from '@ckeditor/ckeditor5-core/src/command';

export default class InsertComponentSelectorCommand extends Command {
    execute() {
        this.editor.model.change( writer => {
            // Insert <componentSelector>*</componentSelector> at the current selection position
            // in a way that will result in creating a valid model structure.
            this.editor.model.insertContent( createComponentSelector( writer ) );
        } );
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'componentSelector' );

        this.isEnabled = allowedIn !== null;
    }
}

function createComponentSelector( writer ) {
    const componentSelector = writer.createElement( 'componentSelector' );
    const simpleBoxTitle = writer.createElement( 'simpleBoxTitle' );
    const simpleBoxDescription = writer.createElement( 'simpleBoxDescription' );

    writer.append( simpleBoxTitle, componentSelector );
    writer.append( simpleBoxDescription, componentSelector );

    // There must be at least one paragraph for the description to be editable.
    // See https://github.com/ckeditor/ckeditor5/issues/1464.
    writer.appendElement( 'paragraph', simpleBoxDescription );

    return componentSelector;
}
