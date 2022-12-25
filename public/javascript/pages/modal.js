// It's js code whicth do all work with modal windows
// It was copied from https://github.com/itchief/ui-components/tree/master/modal
(function() {
    if (typeof window.CustomEvent === "function") return false;

    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: null };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }
    window.CustomEvent = CustomEvent;
})();

$modal = function(options) {
    var
        _elemModal,
        _eventShowModal,
        _eventHideModal,
        _hiding = false,
        _destroyed = false,
        _animationSpeed = 200;

    function _createModal(options) {
        var
            elemModal = document.createElement('div'),
            modalTemplate = '<div class="modal__backdrop" data-dismiss="modal"><div class="modal__content"><div class="modal__header"><div class="" data-modal="title">{{title}}</div></div><div class="modal__body" data-modal="content">{{content}}</div></div></div>',
            modalHTML

        elemModal.classList.add('modal');
        modalHTML = modalTemplate.replace('{{title}}', options.title || 'Новое окно');
        modalHTML = modalHTML.replace('{{content}}', options.content || '');
        elemModal.innerHTML = modalHTML;
        return elemModal;
    }

    function _showModal(event) {
        setTimeout(function() {
            if (!_destroyed && !_hiding) {
                _elemModal.classList.add('modal__show');
                event.target.appendChild(_elemModal)
                document.dispatchEvent(_eventShowModal);
            }
        }, _animationSpeed + 10)
    }

    function _hideModal(event) {
        _hiding = true;
        _elemModal.classList.remove('modal__show');
        _elemModal.classList.add('modal__hiding');
        //event.target.removeChild(_elemModal)
        setTimeout(function() {
            _elemModal.classList.remove('modal__hiding');
            _hiding = false;
        }, _animationSpeed);
        document.dispatchEvent(_eventHideModal);
    }

    _elemModal = _createModal(options || {});

    _eventShowModal = new CustomEvent('show.modal', { detail: _elemModal });
    _eventHideModal = new CustomEvent('hide.modal', { detail: _elemModal });

    return {
        show: _showModal,
        hide: _hideModal,
        destroy: function() {
            _elemModal.parentElement.removeChild(_elemModal),
                _elemModal.removeEventListener('click', _handlerCloseModal),
                _destroyed = true;
        },
        setContent: function(html) {
            _elemModal.querySelector('[data-modal="content"]').innerHTML = html;
        },
        setTitle: function(html) {
            _elemModal.querySelector('[data-modal="title"]').innerHTML = html;
        }
    }
};