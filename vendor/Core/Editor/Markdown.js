import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import trans from 'Core/translations';
import Editable from 'Core/Editable';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat.js';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote.js';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder.js';
import CKFinderUploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter.js';
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices.js';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
import Heading from '@ckeditor/ckeditor5-heading/src/heading.js';
import Image from '@ckeditor/ckeditor5-image/src/image.js';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption.js';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle.js';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar.js';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload.js';
import Indent from '@ckeditor/ckeditor5-indent/src/indent.js';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js';
import Link from '@ckeditor/ckeditor5-link/src/link.js';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed.js';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice.js';
import Table from '@ckeditor/ckeditor5-table/src/table.js';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar.js';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation.js';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Markdown from '@ckeditor/ckeditor5-markdown-gfm/src/markdown';
import List from '@ckeditor/ckeditor5-list/src/list.js';
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting';
import Ry from 'Core/Ry';

import SimpleBox from './simplebox/simplebox';
//import Placeholder from './placeholder/placeholder';

class Tutu extends Component {
    render() {
        return <h3><i className="bi bi-123"></i>Bobo</h3>
    }
}

class InsertNav extends Plugin {
    init() {
        const editor = this.editor;

        editor.ui.componentFactory.add('insertImage', locale => {
            const view = new ButtonView(locale);

            view.set({
                label: 'Insert nav',
                icon: imageIcon,
                tooltip: true
            });

            // Callback executed once the image is clicked.
            view.on('execute', () => {
                const imageURL = prompt('Image URL');

                editor.model.change(writer => {
                    const imageElement = writer.createElement('imageBlock', {
                        src: imageURL
                    });

                    // Insert the image in the current selection location.
                    editor.model.insertContent(imageElement, editor.model.document.selection);
                });
            });

            return view;
        });
    }
}

class Editor extends ClassicEditor { }

// Plugins to include in the build.
Editor.builtinPlugins = [
    Markdown,
    Autoformat,
    BlockQuote,
    Bold,
    CKFinder,
    CKFinderUploadAdapter,
    CloudServices,
    Essentials,
    Heading,
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    Indent,
    Italic,
    Link,
    List,
    MediaEmbed,
    Paragraph,
    PasteFromOffice,
    Table,
    TableToolbar,
    TextTransformation,
    InsertNav,
    SimpleBox,
    //Placeholder,
    SourceEditing
];

// Editor configuration.
Editor.defaultConfig = {
    toolbar: {
        items: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'outdent',
            'indent',
            '|',
            'imageUpload',
            'blockQuote',
            'insertTable',
            'mediaEmbed',
            'undo',
            'redo',
            '|',
            'insertImage',
            'sourceEditing',
            '|',
            'simpleBox'
        ]
    },
    language: 'fr',
    image: {
        toolbar: [
            'imageTextAlternative',
            'imageStyle:inline',
            'imageStyle:block',
            'imageStyle:side'
        ]
    },
    table: {
        contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells'
        ]
    },
    karaks: {
        karaksRenderer: (basedom) => {
            ReactDOM.render(<Tutu />, basedom)
        }
    }
};

class MdEditor extends Component {
    constructor(props) {
        super(props)
        let data = this.props.data.data
        if (!data.field in data)
            data[data.field] = this.getInitialBlockContent(data.field)
        data.resetblock = 0
        this.state = data
        this.getRaw = this.getRaw.bind(this);
        this.handleContent = this.handleContent.bind(this)
        this.resetBlock = this.resetBlock.bind(this)
        this.handleWildcard = this.handleWildcard.bind(this)
        this.editor = React.createRef()
        this.input = React.createRef()
    }

    handleWildcard(event) {
        const checked = event.target.checked
        this.setState(state => {
            state.nsetup.wildcard = checked
            return state
        })
    }

    handleContent(event) {
        const value = event.target.value
        this.setState({
            content: value
        })
    }

    componentDidMount() {
        this.input.current.ry = this
        Editor.create(this.editor.current).then(editor => {
            //CKEditorInspector.attach(editor);
            this.editorInstance = editor
            window.editor = editor
        })
    }

    resetBlock() {
        this.editorInstance.setData(this.getInitialBlockContent(this.state.field))
        this.setState({
            resetblock: 1
        })
    }

    getRaw() {
        const data = { ...this.state }
        data[data.field] = this.editorInstance.getData()
        console.log('eieiieeiei', data.value)
        return data
    }

    render() {
        return <form name="frm_html" method="post" action={this.props.data.data.action}>
            <div className="modal-header">
                {this.props.data.data.title}
            </div>
            <div className="modal-body position-relative">
                <textarea ref={this.editor} className="form-control" name="value" onChange={this.handleContent} defaultValue={this.models('state.content', '')}></textarea>
            </div>
            <div className="modal-footer justify-content-between">
                <button className="btn btn-danger" type="button" onClick={this.resetBlock}>{trans('Réinitialiser')}</button>
                <div>
                    <input type="hidden" name="ry" ref={this.input} />
                    <label className="fancy-checkbox mx-4">
                        <input type="checkbox" checked={this.models('state.nsetup.wildcard', false)} onChange={this.handleWildcard} />
                        <span className="mx-3">{trans("Partout")}</span>
                    </label>
                    <button className="btn btn-primary">{trans('Appliquer')}</button>
                </div>
            </div>
            <input type="hidden" name="resetblock" value={this.state.resetblock} />
            <Ry />
        </form>
    }
}

export default Editable(MdEditor)