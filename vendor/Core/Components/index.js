import React, {Component, Suspense} from 'react';
import Modelizer from 'Core/Modelizer';
import Loading from 'Components/Loading';

class ImageEdit extends Component
{
    static id = 'Image.Edit'

    render() {
        const It = React.lazy(()=>import('./ImageEdit'))
        return <Suspense fallback={<Loading/>}>
            <It data={this.props.data}/>
        </Suspense>
    }
}

Modelizer(ImageEdit)

class Gallery extends Component
{
    static id = 'Gallery'

    render() {
        const It = React.lazy(()=>import('./Gallery'))
        return <Suspense fallback={<Loading/>}>
            <It data={this.props.data}/>
        </Suspense>
    }
}

Modelizer(Gallery)