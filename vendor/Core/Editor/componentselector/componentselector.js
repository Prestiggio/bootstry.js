import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';

export default class ComponentSelector extends Plugin {
    init() {
        const editor = this.editor;

        const schema = editor.model.schema;

        schema.register( 'JsonScript', {
            isObject: true,
            allowWhere: '$block'
        });

        const conversion = editor.conversion;

        conversion.for( 'upcast' ).elementToElement( {
            model: 'JsonScript',
            view: {
                name: 'script',
                attributes: {
                    type: 'application/json+ryEvents'
                }
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'JsonScript',
            view: {
                name: 'script',
                attributes: {
                    type: 'application/json+ryEvents'
                }
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'JsonScript',
            view: ( modelElement, { writer: viewWriter } ) => {
                
                const section = viewWriter.createContainerElement( 'script', { attributes: {
                    type: 'application/json+ryEvents'
                } } );

                return toWidget( section, viewWriter, { label: 'Component selector widget' } );
            }
        } );

        editor.ui.componentFactory.add( 'componentSelector', locale => {
            const view = new ButtonView( locale );

            view.set( {
                label: 'Insert image',
                withText: true,
                tooltip: true
            } );

            // Callback executed once the image is clicked.
            view.on( 'execute', () => {
                editor.model.change( writer => {
                    
                    const imageElement = writer.createElement('JsonScript');
                    writer.append(imageElement, container)

                    // Insert the image in the current selection location.
                    editor.model.insertContent( container, editor.model.document.selection );
                } );
            });

            return view;
        } );
    }
}
