function getStyle(elem, name) {
  if (elem.currentStyle) {
    return elem.currentStyle[name];
  } else {
    return getComputedStyle(elem, false)[name];
  }
}

function setAttr(elem, name, value) {
  elem.setAttribute(name, value);
}

function getAttr(elem, name) {
  return elem.getAttribute(name);
}

function setData(elem, name, value) {
  setAttr(elem, `data-${name}`, value);
}

function getData(elem, name) {
  return getAttr(elem, `data-${name}`);
}

function addClass(elem, className) {
  elem.classList.add(className)
}

function removeClass(elem, className) {
  elem.classList.remove(className)
}

function isInlineElem(elem) {
  return [
    'inline',
    'inline-block',
    'inline-flex',
    'inline-table',
    'inline-grid',
    '-webkit-inline-box',
    'inherit'
  ].indexOf(getStyle(elem, 'display')) !== -1;
}

function getParent(elem, func, startFromParent){
  if(startFromParent){
    elem = elem.parentElement;
  } 
  while(!(elem && func(elem))){
    if(elem === document.documentElement){
      return null;
    }
    elem = elem.parentElement;

  }
  return elem;
}

function getChildRects(parent, dragEl) {
  let rect = parent.getBoundingClientRect();
  let children = parent.children;

  return [].filter.call(children, item => item.id !== 'placeholder' && item !== dragEl).map(child => {
    let childRect = child.getBoundingClientRect();

    return {
      left: childRect.left - rect.left,
      top: childRect.top - rect.top,
      right: childRect.left - rect.left + childRect.width,
      bottom: childRect.top - rect.top + childRect.height,
      width: childRect.width,
      height: childRect.height,
      elem: child
    }
  })
}

window.draggables = {};
let containerId = 1;
let dragEl;
let placeholder;

function createPlaceholder(dragEl, height) {
  let isInline = isInlineElem(dragEl)
  let placeholder = document.createElement(isInline ? 'span' : 'div');
  placeholder.className = 'placeholder';
  placeholder.id = 'placeholder';
  placeholder.style.display = isInline ? 'inline-block' : 'block';
  placeholder.style.height = height+'px';
  return placeholder;
}

function removePlaceholder() {
  if (placeholder && placeholder.parentElement) {
    placeholder.parentElement.removeChild(placeholder)
  }
}

document.addEventListener('dragenter', e => {
  if (!e.defaultPrevented) {
    removePlaceholder();
  }
})


export default class Draggable {
  constructor(container, data, options) {
    this._init(container, data, options);
  }

  static
  default = {
    sortable:true,
    autoTransfer:true,
    groupName: '$group1',
    offsetValue:2,
    placeholderHeight:12,
    moveGroupNames:[],
    cloneTo:function(data){return false}
  }

  _init(container,data, options) {
    this.id = containerId++;
    this.container = container;
    this.data = data;
    this.options = {
      ...Draggable.default,
      ...options
    };

    this.sortContainer = options.sortContainerSelector ? container.querySelector(options.sortContainerSelector) : this.container;

    //保存实例
    window.draggables[this.id] = this;

    this.setupChild();

    setData(this.container,'draggable-id', this.id);
    setData(this.container, 'container-group-name', this.options.groupName);
    setData(this.container, 'container-move-group-names', JSON.stringify(this.options.moveGroupNames));

    this._bindEvent();
  }

  _bindEvent() {
    this.container.addEventListener('dragstart', this._onDragStart, false);
    this.container.addEventListener('dragenter', this._onDragEnter, false);
    this.container.addEventListener('dragover', this._onDragOver, false);
  }

  _onDragStart = (evt) => {
    evt.stopPropagation()

    evt.dataTransfer.effectAllowed = 'move';

    let target = evt.target;

    target = getParent(target, (elem)=>{
      return elem.draggable;
    });

    this.setDragEl(target);

    this.container.addEventListener('dragend', this._onDragEnd, false);
    this.container.addEventListener('dragleave', this._onDragLeave, false);
    this.container.addEventListener('drop', this._onDrop, false);

  }

  _onDragEnd = (evt) => {
    evt.preventDefault();

    dragEl.classList.remove('ghost');

    this.container.removeEventListener('dragleave', this._onDragLeave, false);
    this.container.removeEventListener('dragend', this._onDragEnd, false);
    this.container.removeEventListener('drop', this._onDrop, false);

    setData(dragEl, 'group-name', '');
    setData(dragEl, 'move-group-names', '');

    if (placeholder && placeholder.parentElement) {
      let fromContainer = getParent(dragEl, (elem)=>{
        return getData(elem,'container-group-name');
      },true);
      // let fromContainer = dragEl.parentElement;
      let fromIndex = this.findIndex(dragEl, placeholder);
      let toContainer = getParent(placeholder, (elem)=>{
          return getData(elem,'container-group-name');
        },true);
      let toIndex = this.findIndex(placeholder);

      this.patchEvent(fromContainer, fromIndex, toContainer, toIndex);

      if(this.options.autoTransfer){
        placeholder.parentElement.replaceChild(dragEl, placeholder)
      }else{
        placeholder.parentElement.removeChild(placeholder)
      }
    }
    placeholder = null;
  }

  _onDragEnter = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
  }


  _onDragOver = (evt) => {
    
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'move';

    var target = this.getTarget(evt.target);

    // if(target.id == 'div1'){
    //     debugger;
    // }

    if (target === dragEl) return;

    //不同组
    if(!this.canMoveToContainer()){
      evt.stopPropagation()
      removePlaceholder();
      return;
    }

    var rect = target.getBoundingClientRect();
    var offsetTop = evt.clientY - rect.top;
    var offsetBottom = rect.bottom - rect.top - offsetTop;
    var offsetLeft = evt.clientX - rect.left;
    var offsetRight = rect.right - rect.left - offsetLeft;
    var offsetValue = this.options.offsetValue;
    var bothInlineElement = isInlineElem(dragEl) && isInlineElem(target);


    // console.log(bothInlineElement, offsetLeft, offsetRight)

    //item
    if (target.parentElement === this.container) {
      let dir;
      // if(bothInlineElement){
      //   if (offsetLeft <= offsetValue){
      //     dir = 'prev';
      //   }else if(offsetRight <= offsetValue){
      //     dir = 'next';
      //   }
      // }else{
        if (offsetTop <= offsetValue){
          dir = 'prev';
        }else if(offsetBottom <= offsetValue){
          dir = 'next';
        }
      // }

      if (dir === 'prev') {
        evt.stopPropagation()
        this.move(target);
        return;
      } else if (dir === 'next') {
        evt.stopPropagation()
        this.move(this.getNextSibling(target));
        return;
      }
    }
    //container
    else if(target === this.container){
      // console.log('target:', target.classList.toString(), '| container:', this.container.classList.toString()); 
      //上
      if(offsetTop <= 1){
        // evt.stopPropagation()
        // console.log('container up')
      }
      //下
      else if(offsetBottom <= 1){
        // evt.stopPropagation()
        // console.log('container down')
      }
      //中
      else{
        let findedChild = this.findHitChild(offsetTop);
        findedChild = findedChild && findedChild.elem;
        evt.stopPropagation()
        this.move(findedChild);

      }

    }

  }

  _onDragLeave = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();

  }

  _onDrop = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
  }

  setDragEl(_dragEl) {
    dragEl = _dragEl;
    placeholder = createPlaceholder(dragEl, this.options.placeholderHeight);
    setData(dragEl, 'group-name', getData(this.container, 'container-group-name'));
    setData(dragEl, 'move-group-names', getData(this.container, 'container-move-group-names'));
    setTimeout(() => {
      dragEl.classList.add('ghost');
    }, 0);
  }

  findHitChild(offsetTop) {
    let _isInlineElem = isInlineElem(dragEl);
    let childRects = getChildRects(this.sortContainer, dragEl);
    // console.log(childRects)
    let findedChild = null;
    let max = 0;
    for (let i = 0; i < childRects.length; i++) {
      let currentRect = childRects[i];
      if (offsetTop <= currentRect.top && max < currentRect.top) {
        // debugger;
        findedChild = currentRect;
      }
      max = Math.max(max,currentRect.bottom);
    }
    // console.log(findedChild.elem);
    return findedChild;
  }

  patchEvent(fromContainer, fromIndex, toContainer, toIndex){
    if(fromContainer === toContainer){
      
      const instance = window.draggables[getData(fromContainer,'draggable-id')];
      let data = instance.data[fromIndex];

      instance.data.splice(fromIndex,1);
      instance.data.splice(fromIndex < toIndex ? toIndex-1 : toIndex,0,data);

      instance.options.onChange && instance.options.onChange.call(instance,instance.data);
    }else{
      const fromInstance = window.draggables[getData(fromContainer,'draggable-id')];
      const toInstance = window.draggables[getData(toContainer,'draggable-id')];
      let data = fromInstance.data[fromIndex];
      let cloneData = fromInstance.options.cloneTo(data, getData(toContainer,'container-group-name'));

      //不是clone
      if(cloneData == false){
        fromInstance.data.splice(fromIndex,1);
        toInstance.data.splice(toIndex,0,data);
        fromInstance.options.onChange && fromInstance.options.onChange.call(fromInstance,fromInstance.data);
        toInstance.options.onChange && toInstance.options.onChange.call(toInstance,toInstance.data);
      }else{
        toInstance.data.splice(toIndex,0,cloneData);
        toInstance.options.onChange && toInstance.options.onChange.call(toInstance,toInstance.data);
      }


    }
  }

  setupChild(){
    [].slice.call(this.sortContainer.children).forEach((elem) => {
      if(elem.draggable === false){
        elem.draggable = true;
      }
    });
  }

  canMoveToContainer(){
    let containerGroupName = getData(this.container, 'container-group-name');
    let groupName = getData(dragEl, 'group-name');
    let moveGroupNames = JSON.parse(getData(dragEl, 'move-group-names'));

    //不同组
    if(groupName !== containerGroupName && moveGroupNames.indexOf(containerGroupName) == -1){
      return false;
    }

    return true;
  }

  move(refrerChild) {
    // if(!this.canMoveToContainer()){
    //   removePlaceholder();
    //   return;
    // }

    if(!this.options.sortable){
      return;
    }

    //将placeholder移动到refrerChild前面
    if (refrerChild) {
      if (refrerChild === dragEl || this.getPrevSibling(refrerChild) === dragEl) {
        removePlaceholder();
      } else {
          this.sortContainer.insertBefore(placeholder, refrerChild)
      }
    }
    //没有refrerChild代表要移动到最后
    else {
      if (this.sortContainer.lastElementChild === dragEl) {
        removePlaceholder();
      } else {
        this.sortContainer.appendChild(placeholder);
      }
    }
  }

  setData(data){
    this.data = data;
  }

  refresh(){
    this.setupChild();
  }

  findIndex(elem, ignoreElem){
    let children = elem.parentElement.children;
    return [].filter.call(children, _elem=> _elem !== ignoreElem).indexOf(elem); 
  }

  getTarget(target){

    while(!target.draggable && target != this.container){
      target = target.parentElement;
    }
    return target;
  }

  getPrevSibling(elem){
    return elem.previousElementSibling === placeholder ? placeholder.previousElementSibling : elem.previousElementSibling;
  }

  getNextSibling(elem){
    return elem.nextElementSibling === placeholder ? placeholder.nextElementSibling : elem.nextElementSibling;
  }



}
