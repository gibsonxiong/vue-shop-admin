function getCss(obj, name) {
    // 浏览器兼容
    if (obj.currentStyle) {
        return obj.currentStyle[name];
    }
    else {
        return getComputedStyle(obj, false)[name];
    }
}

function getChildRects(parent) {
    let rect = parent.getBoundingClientRect();
    let children = parent.children;

    return [].filter.call(children, item => item.id !== 'placeholder').map(child => {
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

function createPlaceholder(dragEl) {
    let isInlineElem = ['inline', 'inline-block', 'inline-flex', 'inline-table', 'inline-grid', '-webkit-inline-box', 'inherit'].indexOf(getCss(dragEl, 'display')) !== -1;
    let placeholder = document.createElement(isInlineElem ? 'span' : 'div');
    placeholder.className = 'placeholder';
    placeholder.id = 'placeholder';
    placeholder.style.display = isInlineElem ? 'inline-block' : 'block';
    return placeholder;
}

let placeholder;
export default function draggable(rootEl, onUpdate) {
    var dragEl, nextEl;
    

    [].slice.call(rootEl.children).forEach(function (itemEl) {
        itemEl.draggable = true;
    });

    rootEl.classList.add('v-draggable-wrap');


    

    function _onDragOver(evt) {
        
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'move';
        
        var target = evt.target;

        // if(target.id == 'ul3'){
        //     debugger;
        // }

        if(target === dragEl) return;

        var rect = target.getBoundingClientRect();
        var offsetTop = evt.clientY - rect.top;
        var offsetBottom = rect.bottom - rect.top - offsetTop;
        var offsetValue = 2


        if(target.parentElement.classList.contains('v-draggable-wrap')){
            // if(offsetTop >= offsetValue && offsetBottom >= offsetValue){

            // }
            if (offsetBottom <= offsetValue) {
                target.parentElement.insertBefore(placeholder, target.nextSibling);
                return true;
    
            } else if (offsetTop <= offsetValue) {
                target.parentElement.insertBefore(placeholder, target);
                return true;
            } 
        }
        //parent
        if( target.classList.contains('v-draggable-wrap')){
            let childRects = getChildRects(target);
            let child = childRects.find(rect => {
                return offsetTop < rect.top + offsetValue
            });

            if (child) {
                // console.log(child.elem.previousElementSibling)
                // if(child.elem.previousElementSibling === dragEl)  return;

                target.insertBefore(placeholder, child.elem)
            
            } else {
                // console.log(target,placeholder)
                target.appendChild(placeholder);
            }
        }


    }

    function _onDragEnd(evt) {

        evt.preventDefault();

        dragEl.classList.remove('ghost');
        rootEl.removeEventListener('dragover', _onDragOver, false);
        rootEl.removeEventListener('dragend', _onDragEnd, false);

        
        placeholder && placeholder.parentElement.replaceChild(dragEl, placeholder)
        placeholder = null;
    }

    function _onDragLeave(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.target.classList.remove('target-active');
    }

    function _onDrop(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.target.classList.remove('target-active');
    }

    rootEl.addEventListener('dragstart', function (evt) {
        dragEl = evt.target; 
        nextEl = dragEl.nextSibling;
        placeholder = createPlaceholder(dragEl);

        evt.dataTransfer.effectAllowed = 'move';

        
        rootEl.addEventListener('dragend', _onDragEnd, false);
        rootEl.addEventListener('dragleave', _onDragLeave, false);
        rootEl.addEventListener('drop', _onDrop, false);

        setTimeout(function () {
            dragEl.classList.add('ghost');
        }, 0)
    }, false);

    rootEl.addEventListener('dragenter', function (e){
        e.preventDefault();
    }, false);

    rootEl.addEventListener('dragover', _onDragOver, false);
}