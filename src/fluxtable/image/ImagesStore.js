/**
 * Created by Mirek on 2015-10-02.
 */
import BaseStore from './../lib/BaseStore'
import {imagesActionCreator,LoadAllContainers,RemoveContainer} from './ImagesActionCreator';
import {CreateImage} from './../container/ContainersActionCreator';
import _sortByOrder from 'lodash/collection/sortByOrder';

class ImagesStore extends BaseStore {
    constructor() {
        super();
    }


    dispacherListener(action) {
        switch (action.constructor) {
            case LoadAllContainers:
                var data = _sortByOrder(action.data, ['RepoTags']);
                if (PROD) {
                    data = data.filter((element)=> {
                        return element.RepoTags[0].indexOf('next') == -1
                    });
                }
                this.setData(data);
                break;
            case CreateImage:
                imagesActionCreator.loadAll();
                break;
            case RemoveContainer:
                imagesActionCreator.loadAll();
                break;
            default:
        }
    }

    initImpl() {
        imagesActionCreator.loadAll();

    }

}
export default new ImagesStore();

