function getStyle(obj, name) {
    // 浏览器兼容
    if (obj.currentStyle) {
        return obj.currentStyle[name];
    }
    else {
        return getComputedStyle(obj, false)[name];
    }
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

function getChildRects(parent, dragEl) {
    let rect = parent.getBoundingClientRect();
    let children = parent.children;

    return [].filter.call(children, item => item.id !== 'placeholder' && item !== dragEl).map(child => {
        let childRect = child.getBoundingClientRect();

        return {
            left: childRect.left - rect.left,
            top: childRect.top - rect.top,
            right: childRect.right - rect.right,
            bottom: childRect.bottom - rect.bottom,
            elem: child
        }
    })
}




let dragEl;
let placeholder;

function createPlaceholder(dragEl) {
    let isInline = isInlineElem(dragEl)
    let placeholder = document.createElement(isInline ? 'span' : 'div');
    placeholder.className = 'placeholder';
    placeholder.id = 'placeholder';
    placeholder.style.display = isInline ? 'inline-block' : 'block';
    return placeholder;
}

function removePlaceholder() {
    if (placeholder && placeholder.parentElement) {
        placeholder.parentElement.removeChild(placeholder)
    }
}

document.addEventListener('dragenter',e=>{
    console.log(e.defaultPrevented)
    if(!e.defaultPrevented){
        removePlaceholder();
    }
})

export default class Draggable {
    constructor(rootEl, options) {
        this._init(rootEl, options);
    }


    _init(rootEl, options) {
        this.rootEl = rootEl;
        this.options = options;

        [].slice.call(this.rootEl.children).forEach(function (itemEl) {
            itemEl.draggable = true;
        });

        this.rootEl.classList.add('v-draggable-wrap');

        this._bindEvent();
    }

    _bindEvent() {
        this.rootEl.addEventListener('dragstart', this._onDragStart, false);
        this.rootEl.addEventListener('dragenter', this._onDragEnter, false);
        this.rootEl.addEventListener('dragover', this._onDragOver, false);
    }

    _onDragStart = (evt) => {
        dragEl = evt.target;
        placeholder = createPlaceholder(dragEl);

        evt.dataTransfer.effectAllowed = 'move';

        this.rootEl.addEventListener('dragend', this._onDragEnd, false);
        this.rootEl.addEventListener('dragleave', this._onDragLeave, false);
        this.rootEl.addEventListener('drop', this._onDrop, false);

        setTimeout(() => {
            dragEl.classList.add('ghost');
        }, 0)
    }

    _onDragEnd = (evt) => {
        evt.preventDefault();

        dragEl.classList.remove('ghost');

        this.rootEl.removeEventListener('dragleave', this._onDragLeave, false);
        this.rootEl.removeEventListener('dragend', this._onDragEnd, false);
        this.rootEl.removeEventListener('drop', this._onDrop, false);

        if (placeholder && placeholder.parentElement) {
            placeholder.parentElement.replaceChild(dragEl, placeholder)
        }
        placeholder = null;
    }

    _onDragEnter = (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
    }

    _onDragOver = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'move';

        var target = evt.target;

        // if(target.id == 'ul3'){
        //     debugger;
        // }

        if (target === dragEl) return;

        var rect = target.getBoundingClientRect();
        var offsetTop = evt.clientY - rect.top;
        var offsetBottom = rect.bottom - rect.top - offsetTop;
        var offsetValue = 3


        if (target.parentElement.classList.contains('v-draggable-wrap')) {

            if (offsetTop <= offsetValue) {
                if (target.previousElementSibling === dragEl) {
                    removePlaceholder();
                } else {
                    target.parentElement.insertBefore(placeholder, target);
                }
                return true;
            } else if (offsetBottom <= offsetValue) {
                if (target.nextElementSibling === dragEl) {
                    removePlaceholder();
                } else {
                    target.parentElement.insertBefore(placeholder, target.nextSibling);
                }
                return true;

            }
        }
        //parent
        if (target.classList.contains('v-draggable-wrap')) {
            let childRects = getChildRects(target, dragEl);
            let child = childRects.find(rect => {
                return offsetTop < rect.top + offsetValue
            });

            if (child) {
                if (child.elem.previousElementSibling === dragEl) {
                    removePlaceholder();
                } else {
                    target.insertBefore(placeholder, child.elem)
                }
                return true;
            } else {
                if (target.lastElementChild === dragEl) {
                    removePlaceholder();
                } else {
                    target.appendChild(placeholder);
                }
                return true;
            }
        }
    }

    _onDragLeave = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();

        let target = evt.target;

        target.classList.remove('target-active');

        console.log(target.id)

        if( target.classList.contains('v-draggable-wrap') && !target.parentElement.classList.contains('v-draggable-wrap')){
            console.log(evt)
        }
    }



    _onDrop = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        evt.target.classList.remove('target-active');
    }


}