import EventServices from './eventServices.js';
import GreenspaceServices from './greenspaceServices';
import ReviewServices from './reviewServices';
import UserServices from './userServices';
import TagServices from './tagServices';

export default {
    event: EventServices,
    greenspace: GreenspaceServices,
    review: ReviewServices,
    user: UserServices,
    tag: TagServices,
}
