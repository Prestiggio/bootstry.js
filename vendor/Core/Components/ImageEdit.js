import React, {Component} from 'react';
import Form from 'Core/Form';
import trans from 'Core/translations';

class ImageEdit extends Component
{
    render() {
        return <Form name='frm_image_edit' method='post' action={`/${this.props.data.theme}/cache`}>
            <img src={this.props.data.image.url}/>
            <div className='form-group'>
                <input type="text" name="url" className="form-control" defaultValue={this.props.data.image.url}/>
                <input type="hidden" name="key" value={this.props.data.image.key}/>
            </div>
            <button className='btn btn-primary'>{trans('Enregistrer')}</button>
        </Form>
    }
}

export default ImageEdit;