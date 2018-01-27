import EventServices from './eventServices.js';
import GreenspaceServices from './greenspaceServices';
import ReviewServices from './reviewServices';
import UserServices from './userServices';
import TagServices from './tagServices';
import DiscoverServices from './discoverServices';

export default {
    event: EventServices,
    greenspace: GreenspaceServices,
    review: ReviewServices,
    user: UserServices,
    tag: TagServices,
    discover: DiscoverServices,
}
