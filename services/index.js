import EventServices from './eventServices.js';
import GreenspaceServices from './greenspaceServices';
import ReviewServices from './reviewServices';
import UserServices from './userServices';

export default {
    event: EventServices,
    greenspace: GreenspaceServices,
    review: ReviewServices,
    user: UserServices,
}
