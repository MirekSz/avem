/**
 * Created by Mirek on 2015-11-09.
 */

export class BaseFilter {

    init(component) {
        this.component = component;
        this.initImpl();
    }

    initImpl() {

    }

    action() {
        if (this.component) {
            this.actionImpl(this.component.state.filters);
            this.component.setState(this.component.getData());
        }
    }

    actionImpl() {
    }

    getPresentation() {
        if (this.component) {
            return this.getPresentationImpl(this.component.state.filters);
        }
    }

    getPresentationImpl(filters) {
    }

    reduce(data) {

    }
}
