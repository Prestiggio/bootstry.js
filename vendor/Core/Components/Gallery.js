import React, {Component} from 'react';
import trans from 'Core/translations';
import Modelizer from 'Core/Modelizer';

class Gallery extends Component
{
    render() {
        return <div id="carouselExampleAutoplaying" className="carousel slide pb-0" data-bs-ride="carousel">
        <div className="carousel-inner">
            {this.models('props.data.data.medias', []).map((media, index)=><div key={media.id} className={`carousel-item body-violet text-center ${index===0?'active':''}`}>
            <img src={media.fullpath} className="img-fluid" alt={media.title}/>
          </div>)}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
          <span className='bi bi-chevron-left fs-1 text-primary'></span>
          <span className="visually-hidden">{trans('Taloha')}</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
          <span className="bi bi-chevron-right fs-1 text-primary" aria-hidden="true"></span>
          <span className="visually-hidden">{trans('Manaraka')}</span>
        </button>
      </div>
    }
}

export default Modelizer(Gallery)