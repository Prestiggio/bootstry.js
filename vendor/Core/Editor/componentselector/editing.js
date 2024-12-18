// simplebox/simpleboxediting.js

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import InsertComponentSelectorCommand from './insertcommand'; 

export default class ComponentSelectorEditing extends Plugin {
    static get requires() {                                                    // ADDED
        return [ Widget ];
    }

    init() {
        console.log( 'ComponentSelectorEditing#init() got called' );

        this._defineSchema();                                                  // ADDED
        this._defineConverters();

        this.editor.commands.add( 'insertComponentSelector', new InsertComponentSelectorCommand( this.editor ) );
    }

    _defineSchema() {                                                          // ADDED
        const schema = this.editor.model.schema;

        schema.register( 'componentSelector', {
            // Behaves like a self-contained object (e.g. an image).
            isObject: true,

            // Allow in places where other blocks are allowed (e.g. directly in the root).
            allowWhere: '$block'
        } );

        schema.register( 'simpleBoxTitle', {
            // Cannot be split or left by the caret.
            isLimit: true,

            allowIn: 'componentSelector',

            // Allow content which is allowed in blocks (i.e. text with attributes).
            allowContentOf: '$block'
        } );

        schema.register( 'simpleBoxDescription', {
            // Cannot be split or left by the caret.
            isLimit: true,

            allowIn: 'componentSelector',

            // Allow content which is allowed in the root (e.g. paragraphs).
            allowContentOf: '$root'
        } );

        schema.addChildCheck( ( context, childDefinition ) => {
            if ( context.endsWith( 'simpleBoxDescription' ) && childDefinition.name == 'componentSelector' ) {
                return false;
            }
        } );
    }

    _defineConverters() {   
        const editor = this.editor;                                                   // ADDED
        const conversion = this.editor.conversion;
        const renderKaraks = editor.config.get( 'karaks' ).karaksRenderer;

        conversion.for( 'upcast' ).elementToElement( {
            model: 'componentSelector',
            view: {
                name: 'section',
                classes: 'simple-box'
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'componentSelector',
            view: {
                name: 'section',
                classes: 'simple-box'
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'componentSelector',
            view: ( modelElement, { writer: viewWriter } ) => {
                const section = viewWriter.createContainerElement( 'section', { class: 'simple-box' } );

                return toWidget( section, viewWriter, { label: 'simple box widget' } );
            }
        } );

        conversion.for( 'upcast' ).elementToElement( {
            model: 'simpleBoxTitle',
            view: {
                name: 'h1',
                classes: 'simple-box-title'
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'simpleBoxTitle',
            view: {
                name: 'h1',
                classes: 'simple-box-title'
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'simpleBoxTitle',
            view: ( modelElement, { writer: viewWriter } ) => {
                // Note: You use a more specialized createEditableElement() method here.
                const h1 = viewWriter.createEditableElement( 'h1', { class: 'simple-box-title' } );

                return toWidgetEditable( h1, viewWriter );
            }
        } );

        conversion.for( 'upcast' ).elementToElement( {
            model: 'simpleBoxDescription',
            view: {
                name: 'div',
                classes: 'simple-box-description'
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'simpleBoxDescription',
            view: ( modelElement, { writer: viewWriter } )=>{
                const div = viewWriter.createEditableElement( 'div', { class: 'simple-box-description' } );

                // The inner <div class="product__react-wrapper"></div> element.
                // This element will host a React <ProductPreview /> component.
                const reactWrapper = viewWriter.createRawElement( 'div', {
                    class: 'karaks__react-wrapper'
                }, function( domElement ) {
                    // This the place where React renders the actual product preview hosted
                    // by a UIElement in the view. You are using a function (renderer) passed as
                    // editor.config.products#productRenderer.
                    renderKaraks( domElement );
                } );

                viewWriter.insert( viewWriter.createPositionAt( div, 0 ), reactWrapper );

                return div
            }
            /*view: {
                name: 'div',
                classes: 'simple-box-description'
            }*/
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'simpleBoxDescription',
            view: ( modelElement, { writer: viewWriter } ) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createEditableElement( 'div', { class: 'simple-box-description' } );

                // The inner <div class="product__react-wrapper"></div> element.
                // This element will host a React <ProductPreview /> component.
                const reactWrapper = viewWriter.createRawElement( 'div', {
                    class: 'karaks__react-wrapper'
                }, function( domElement ) {
                    // This the place where React renders the actual product preview hosted
                    // by a UIElement in the view. You are using a function (renderer) passed as
                    // editor.config.products#productRenderer.
                    renderKaraks( domElement );
                } );

                viewWriter.insert( viewWriter.createPositionAt( div, 0 ), reactWrapper );

                return toWidgetEditable( div, viewWriter );
            }
        } );
    }
}
