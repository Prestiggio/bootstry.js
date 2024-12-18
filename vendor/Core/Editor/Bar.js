import React, {Component} from 'react';
import trans from 'Core/translations';
import Modelizer from 'Core/Modelizer';
import qs from 'qs';
import store from 'Core/Store';
import {INITIAL} from 'Core/Editable';
import Draggable from 'react-draggable';

class Bar extends Component
{
  constructor(props) {
    super(props)
    this.editSeo = this.editSeo.bind(this)
    this.newPage = this.newPage.bind(this)
    this.quit = this.quit.bind(this)
    this.download = this.download.bind(this)
    this.deletePage = this.deletePage.bind(this)
    this.changeTemplate = this.changeTemplate.bind(this)
  }

  deletePage() {
    $.ajax({
        type: 'delete',
        url: `/${this.props.data.theme}/page`,
        data: {
            page: this.props.data.route_action.parameters.page
        },
        success: response=>{
            window.close()
        }
    })
  }

  download() {
    let queries = qs.parse(document.location.search.replace(/^\?/, ''))
    queries.themer = 1
    window.open(document.location.pathname + '?' + qs.stringify(queries))
  }

  newPage() {
    store.dispatch({
      type: 'dialog',
      url: `/${this.props.data.theme}/new_page`,
      method: 'post',
      data: {
        title : trans('Titre de la nouvelle page'),
        field : 'title'
      }
    })
  }

  changeTemplate() {
    store.dispatch({
        type: 'dialog',
        url: `/${this.props.data.theme}/edit_template`,
        method: 'post',
        data: {
          route_action : INITIAL.route_action,
          title : trans('Modifier la template'),
          field : 'layout'
        }
    })
  }

  componentDidMount() {
    store.subscribe(()=>{
      const storeState = store.getState()
      if(storeState.type=='title') {
        document.title = storeState.inline_content
        store.dispatch({
          type: 'dialog.dismiss'
        })
      }
      if(storeState.type=='keywords' || storeState.type=='description' || storeState.type=='image') {
        store.dispatch({
            type: 'dialog.dismiss'
        })
      }
      if(storeState.type=='reseted') {
        document.location.reload()
      }
      if(storeState.type=='new_page') {
        window.open(storeState.url)
      }
    })
  }

  editSeo(tag) {
    store.dispatch({
      type: 'dialog',
      display: 'modal-xl',
      url: `/${this.props.data.theme}/dialog`,
      method: 'post',
      data: {
        route_action : INITIAL.route_action,
        title : trans(`Balise ${tag} de cette page`),
        field : tag
      }
    })
  }

  quit() {
    store.dispatch({
      type: 'quit_editor'
    })
  }

  render() {
    return <Draggable>
      <div className="bg-dark d-flex justify-content-between shadow border border-5 rounded-3">
        <div className="btn-group flex-wrap">
          <button className="btn btn-primary" type="button" onClick={()=>this.editSeo('title')} onTouchStart={()=>this.editSeo('title')}><i className="fa fa-pen-fancy"></i> {trans('Changer titre')}</button>
          <button className="btn btn-primary" type="button" onClick={()=>this.editSeo('keywords')} onTouchStart={()=>this.editSeo('keywords')}><i className="fa fa-pen-fancy"></i> {trans('Changer mots clés')}</button>
          <button className="btn btn-primary" type="button" onClick={()=>this.editSeo('description')} onTouchStart={()=>this.editSeo('description')}><i className="fa fa-pen-fancy"></i> {trans('Changer description')}</button>
          <button className="btn btn-primary" type="button" onClick={()=>this.editSeo('image')} onTouchStart={()=>this.editSeo('image')}><i className="fa fa-pen-fancy"></i> {trans('Changer image')}</button>
          <button className="btn btn-primary" type="button" onClick={this.changeTemplate} onTouchStart={this.changeTemplate}><i className="fa fa-pen-fancy"></i> {trans('Changer template')}</button>
          <button className="btn btn-info" type="button" onClick={this.newPage} onTouchStart={this.newPage}><i className="fa fa-file"></i> {trans('Nouvelle page')}</button>
          <button className="btn btn-outline-info" type="button" onClick={this.download} onTouchStart={this.download}><i className="fa fa-download"></i> {trans('Télécharger React HTML')}</button>
          <input type="text" className='control-input' defaultValue={`?edit_token=${this.props.data.edit_token}`}/>
          <button className="btn btn-danger" type="button" onClick={this.deletePage} onTouchStart={this.deletePage}><i className="fa fa-pen-fancy"></i> {trans('Supprimer cette page')}</button>
        </div>
        <button className="btn btn-danger" type="button" onClick={this.quit} onTouchStart={this.quit}>{trans('Quitter le mode éditeur')} <i className="fa fa-times-circle"></i></button>
      </div>
    </Draggable>
  }
}

export default Modelizer(Bar);