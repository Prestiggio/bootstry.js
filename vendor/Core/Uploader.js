import React, {Component} from 'react';
import trans, {LOADINGSTART, LOADINGEND} from 'Core/translations';
import Dropzone from 'Core/dropzone';

class Uploader extends Component
{
    constructor(props) {
        super(props)
        this.container = React.createRef()
        this.addBlob = this.addBlob.bind(this)
    }

    addBlob(blob) {
        this.dz.addFile(blob)
    }

    componentDidMount() {
        this.dz = new Dropzone(this.container.current, {
            url : this.props.action,
            paramName : this.props.name,
            acceptedFiles: this.props.acceptedFiles, // eg : '.png,.jpg,.jpeg,.gif'
            accept: (file, done)=>{
                if(this.props.preUpload)
                    this.props.preUpload(file, done)
                else
                    done()
            },
            params: ()=>{
                const dump = this.props.params ? this.props.params.call(this):{}
                dump.id = this.props.id
                return dump
            },
            dictCancelUpload: trans('Annuler'),
            dictCancelUploadConfirmation: trans("Êtes-vous certain d'annuler le transfert?"),
            dictInvalidFileType: trans(`Ce type de fichier n'est pas pris en charge`),
            previewTemplate: `<div style="display: none;"></div>`,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            clickable: this.props.clickable ?? true
        })
        const LOGOadded = (file) => {
            if(this.props.preview) {
                if(/^image/.test(file.type)) {
                    const imgContainer = $(this.props.preview);
                    var reader = new FileReader();
        
                    reader.onload = function (e) {
                        imgContainer.attr('src', e.target.result);
                    };
        
                    reader.readAsDataURL(file);
                }
            }
            
        };
        this.dz.on('addedfile', LOGOadded);
        this.dz.on("sending", ()=>LOADINGSTART(this.props.name));
        this.dz.on("complete", ()=>LOADINGEND(this.props.name));
        this.dz.on("success", (event, response)=>{
            if(this.props.onSuccess) {
                this.props.onSuccess.call(this, response)
            }
        })
    }

    render() {
        const elementAttr = {...this.props}
        delete elementAttr.action
        delete elementAttr.name
        delete elementAttr.onSuccess
        delete elementAttr.params
        delete elementAttr.acceptedFiles
        delete elementAttr.clickable
        delete elementAttr.preUpload
        return <div {...elementAttr} ref={this.container} role="button">
            {this.props.children}
        </div>
    }
}

export default Uploader