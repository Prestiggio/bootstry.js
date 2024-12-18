// simplebox/simpleboxui.js

import ListView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class ComponentSelectorUI extends Plugin {
    init() {
        console.log( 'ComponentSelectorUI#init() got called' );

        const editor = this.editor;
        const t = editor.t;

        // The "componentSelector" button must be registered among the UI components of the editor
        // to be displayed in the toolbar.
        editor.ui.componentFactory.add( 'componentSelector', locale => {
            // The state of the button will be bound to the widget command.
            const command = editor.commands.get( 'insertComponentSelector' );
            
            // The button will be an instance of ButtonView.
            const listView = new ListView( locale );

            listView.set({
                label: t('gsrygf')
            })

            // Execute the command when the button is clicked (executed).
            this.listenTo( listView, 'execute', () => editor.execute( 'insertComponentSelector' ) );

            return listView;
        } );
    }
}
