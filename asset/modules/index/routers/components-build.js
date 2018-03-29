const Login = require('../../../views/Login.vue')
import Register from '../../../views/Register.vue'
import FindPassword from '../../../views/FindPassword.vue'
import Home from '../../../views/404.vue'
import ActivityActiveList from '../../../views/Activity/ActiveList.vue'
import Feed from '../../../views/Feed.vue'
import SearchSearchQuestion from '../../../views/Search/SearchQuestion.vue'
import SearchSearchSubmission from '../../../views/Search/SearchSubmission.vue'
import SearchSearchTag from '../../../views/Search/SearchTag.vue'
import SearchSearchUser from '../../../views/Search/SearchUser.vue'
import ActivityOpportunityList from '../../../views/Activity/OpportunityList.vue'
import ActivityEnrollmentStatus from '../../../views/Activity/EnrollmentStatus.vue'
import NewcomerGuidanceStepOne from '../../../views/NewcomerGuidance/StepOne.vue'
import NewcomerGuidanceStepTwo from '../../../views/NewcomerGuidance/StepTwo.vue'
import NewcomerGuidanceStepThree from '../../../views/NewcomerGuidance/StepThree.vue'
import InvitationFriends from '../../../views/Invitation/Friends.vue'
import AskCommunityMajorList from '../../../views/AskCommunity/MajorList.vue'
import AskCommunityMajorDetail from '../../../views/AskCommunity/MajorDetail.vue'
import AskCommunityInteractionAnswers from '../../../views/AskCommunity/InteractionAnswers.vue'
import AskCommunityInteractionDetail from '../../../views/AskCommunity/InteractionDetail.vue'
import RecommendInvitationUsers from '../../../views/RecommendInvitationUsers.vue'
import Contact from '../../../views/Contact.vue'
import componentsinvitationimage from '../../../components/invitation/image.vue'
import InvitationInfo from '../../../views/Invitation/Info.vue'
import InvitationRegister from '../../../views/Invitation/Register.vue'
import Invitationindex from '../../../views/Invitation/index.vue'
import InvitationSuccess from '../../../views/Invitation/Success.vue'
import InvitationPreview from '../../../views/Invitation/Preview.vue'
import InvitationImage from '../../../views/Invitation/Image.vue'
import DiscoverCompanyServices from '../../../views/Discover/CompanyServices.vue'
import DiscoverHotTopic from '../../../views/Discover/HotTopic.vue'
import DiscoverNewest from '../../../views/Discover/Newest.vue'
import DiscoverPublishArticles from '../../../views/Discover/PublishArticles.vue'
import DiscoverAddSuccess from '../../../views/Discover/AddSuccess.vue'
import DiscoverList from '../../../views/Discover/List.vue'
import DiscoverDetail from '../../../views/Discover/Detail.vue'
import ActivityInvitationList from '../../../views/Activity/InvitationList.vue'
import ActivityGrowthList from '../../../views/Activity/GrowthList.vue'
import Accountmy from '../../../views/Account/my.vue'
import AccountCollected from '../../../views/Account/Collected.vue'
import AccountCollectedArticle from '../../../views/Account/CollectedArticle.vue'
import AccountAdvantage from '../../../views/Account/Advantage.vue'
import TagsSelectionTags from '../../../views/Tags/SelectionTags.vue'
import TagsTagsQuestions from '../../../views/Tags/TagsQuestions.vue'
import TagsTagsSubmissions from '../../../views/Tags/TagsSubmissions.vue'
import TagsTagsUsers from '../../../views/Tags/TagsUsers.vue'
import TagsTagFocusMembers from '../../../views/Tags/TagFocusMembers.vue'
import AccountDiscountList from '../../../views/Account/DiscountList.vue'
import AccountChanceList from '../../../views/Account/ChanceList.vue'
import AccountGrowth from '../../../views/Account/Growth.vue'
import AccountExpertpilot from '../../../views/Account/Expertpilot.vue'
import Accountfocus from '../../../views/Account/focus.vue'
import AccountpublishpublishAnswers from '../../../views/Account/publish/publishAnswers.vue'
import AccountpublishpublishQuestions from '../../../views/Account/publish/publishQuestions.vue'
import AccountpublishpublishArticle from '../../../views/Account/publish/publishArticle.vue'
import AccountpublishpublishComment from '../../../views/Account/publish/publishComment.vue'
import AccountArticleList from '../../../views/Account/ArticleList.vue'
import AccountDynamicList from '../../../views/Account/DynamicList.vue'
import Accountinfo from '../../../views/Account/info.vue'
import AccountResume from '../../../views/Account/Resume.vue'
import Accountinfosjob from '../../../views/Account/infos/job.vue'
import Accountinfosproject from '../../../views/Account/infos/project.vue'
import Accountinfosedu from '../../../views/Account/infos/edu.vue'
import Accountinfosedus from '../../../views/Account/infos/edus.vue'
import Accountinfosjobs from '../../../views/Account/infos/jobs.vue'
import Accountinfosprojects from '../../../views/Account/infos/projects.vue'
import Accountinfostrains from '../../../views/Account/infos/trains.vue'
import componentsPageTransition from '../../../components/PageTransition.vue'
import Accountinfosbasic from '../../../views/Account/infos/basic.vue'
import Accountinfosbasicdescription from '../../../views/Account/infos/basic_description.vue'
import Accountinfosbasicname from '../../../views/Account/infos/basic_name.vue'
import Accountinfosbasicaddress from '../../../views/Account/infos/basic_address.vue'
import Accountinfosbasiccompany from '../../../views/Account/infos/basic_company.vue'
import Accountinfosbasicposition from '../../../views/Account/infos/basic_position.vue'
import Accountinfosbasicemail from '../../../views/Account/infos/basic_email.vue'
import Accountinfosprivacy from '../../../views/Account/infos/privacy.vue'
import Accountinfostrain from '../../../views/Account/infos/train.vue'
import Financeinfo from '../../../views/Finance/info.vue'
import Financelist from '../../../views/Finance/list.vue'
import Financewithdraw from '../../../views/Finance/withdraw.vue'
import Financesetting from '../../../views/Finance/setting.vue'
import TagsindustryTagsIndexedlist from '../../../views/Tags/industryTagsIndexedlist.vue'
import Expertindex from '../../../views/Expert/index.vue'
import Expertapply from '../../../views/Expert/apply.vue'
import ExpertapplySuccess from '../../../views/Expert/applySuccess.vue'
import Expertrecommend from '../../../views/Expert/recommend.vue'
import AskAsk from '../../../views/Ask/Ask.vue'
import AskAskInteraction from '../../../views/Ask/AskInteraction.vue'
import PayAskSuccess from '../../../views/Pay/AskSuccess.vue'
import PayPaySuccess from '../../../views/Pay/PaySuccess.vue'
import AskAskSuccess from '../../../views/Ask/AskSuccess.vue'
import AskAskType from '../../../views/Ask/AskType.vue'
import TaskTaskListSub from '../../../views/Task/TaskListSub.vue'
import TaskInformList from '../../../views/Task/InformList.vue'
import TaskTaskbar from '../../../views/Task/Taskbar.vue'
import Taskreadbar from '../../../views/Task/readbar.vue'
import Taskinformbar from '../../../views/Task/informbar.vue'
import Taskintegralbar from '../../../views/Task/integralbar.vue'
import Taskbalancebar from '../../../views/Task/balancebar.vue'
import Taskchat from '../../../views/Task/chat.vue'
import AskAskDetail from '../../../views/Ask/AskDetail.vue'
import AskAskList from '../../../views/Ask/AskList.vue'
import AskAskListFinish from '../../../views/Ask/AskListFinish.vue'
import AnswerAnswerList from '../../../views/Answer/AnswerList.vue'
import AnswerAnswerListFinished from '../../../views/Answer/AnswerListFinished.vue'
import AnswerAnswerDetail from '../../../views/Answer/AnswerDetail.vue'
import AnswerRefuse from '../../../views/Answer/Refuse.vue'
import AnswerSelectTime from '../../../views/Answer/SelectTime.vue'
import AnswerAnswer from '../../../views/Answer/Answer.vue'
import AskComment from '../../../views/Ask/Comment.vue'
import AccountselectHeader from '../../../views/Account/selectHeader.vue'
import AccountselectHeaderH5 from '../../../views/Account/selectHeaderH5.vue'
import AccountselectCompany from '../../../views/Account/selectCompany.vue'
import NearbynearbyPeople from '../../../views/Nearby/nearbyPeople.vue'
import NearbynearbyCompany from '../../../views/Nearby/nearbyCompany.vue'
import NearbynearbyPeopleMapDetail from '../../../views/Nearby/nearbyPeopleMapDetail.vue'
import NearbynearbyCompanyMapDetail from '../../../views/Nearby/nearbyCompanyMapDetail.vue'
import NearbycompanyDetails from '../../../views/Nearby/companyDetails.vue'
import UnansweredQuestions from '../../../views/UnansweredQuestions.vue'
import SelectionRecommend from '../../../views/SelectionRecommend.vue'
import DiscoverAdd4 from '../../../views/Discover/Add4.vue'
import DiscoverAdd from '../../../views/Discover/Add.vue'
import AddressNearby from '../../../views/Address/Nearby.vue'
import ReadhubReadhub from '../../../views/Readhub/Readhub.vue'
import DiscoverComment from '../../../views/Discover/Comment.vue'
import ReadhubDetailH5 from '../../../views/Readhub/DetailH5.vue'
import AccountSetting from '../../../views/Account/Setting.vue'
import Guide from '../../../views/Guide.vue'
import Feedback from '../../../views/Feedback.vue'
import About from '../../../views/About.vue'
import SettingpushSetting from '../../../views/Setting/pushSetting.vue'
import SettingpushSettingFollow from '../../../views/Setting/pushSettingFollow.vue'
import SettingpushSettingAboutMe from '../../../views/Setting/pushSettingAboutMe.vue'
import SeekingCooperation from '../../../views/SeekingCooperation.vue'
import Project from '../../../views/Project.vue'
import HelpAsk from '../../../views/Help/Ask.vue'
import ProjectForm from '../../../views/ProjectForm.vue'
import SelectUserSelectUsers from '../../../views/SelectUser/SelectUsers.vue'
import AccountcollectUser from '../../../views/Account/collectUser.vue'
import AccountcollectTags from '../../../views/Account/collectTags.vue'
import AccountcollectQuestion from '../../../views/Account/collectQuestion.vue'
import CompanyMy from '../../../views/Company/My.vue'
import CompanyHelp from '../../../views/Company/Help.vue'
import CompanySubmit from '../../../views/Company/Submit.vue'
import CompanySuccess from '../../../views/Company/Success.vue'
import ActivityAsk from '../../../views/Activity/Ask.vue'
import ProjectBasic from '../../../views/Project/Basic.vue'
import ProjectConcrete from '../../../views/Project/Concrete.vue'
import ProjectLike from '../../../views/Project/Like.vue'
import ProjectCompany from '../../../views/Project/Company.vue'
import ProjectList from '../../../views/Project/List.vue'
import ProjectReview from '../../../views/Project/Review.vue'
import HelpProtocol from '../../../views/Help/Protocol.vue'
import HelpInvitation from '../../../views/Help/Invitation.vue'
import HelpQuestion from '../../../views/Help/Question.vue'
import WechatRegister from '../../../views/Wechat/Register.vue'
import WechatInfo from '../../../views/Wechat/Info.vue'
import Webviewnotice from '../../../views/Webview/notice.vue'
import WebviewVendor from '../../../views/Webview/Vendor.vue'
import Webviewarticle from '../../../views/Webview/article.vue'
import WebviewShare from '../../../views/Webview/Share.vue'
import WebviewregisterForm from '../../../views/Webview/registerForm.vue'
import DialogList from '../../../views/DialogList.vue'
import ExceptionError from '../../../views/Exception/Error.vue'
import Hongbao from '../../../views/Hongbao.vue'
import Ad from '../../../views/Ad.vue'
import componentsShortTcut from '../../../components/ShortTcut.vue'
import Page404 from '../../../views/404.vue'

export {
  Login,
  Register,
  FindPassword,
  Home,
  Feed,
  SearchSearchQuestion,
  SearchSearchSubmission,
  SearchSearchTag,
  SearchSearchUser,
  ActivityActiveList,
  ActivityOpportunityList,
  ActivityEnrollmentStatus,
  NewcomerGuidanceStepOne,
  NewcomerGuidanceStepTwo,
  NewcomerGuidanceStepThree,
  InvitationFriends,
  AskCommunityMajorList,
  AskCommunityMajorDetail,
  AskCommunityInteractionAnswers,
  AskCommunityInteractionDetail,
  RecommendInvitationUsers,
  Contact,
  componentsinvitationimage,
  InvitationInfo,
  InvitationRegister,
  Invitationindex,
  InvitationSuccess,
  InvitationPreview,
  InvitationImage,
  DiscoverCompanyServices,
  DiscoverHotTopic,
  DiscoverNewest,
  DiscoverPublishArticles,
  DiscoverAddSuccess,
  DiscoverList,
  DiscoverDetail,
  ActivityInvitationList,
  ActivityGrowthList,
  Accountmy,
  AccountCollected,
  AccountCollectedArticle,
  AccountAdvantage,
  TagsSelectionTags,
  TagsTagsQuestions,
  TagsTagsSubmissions,
  TagsTagsUsers,
  TagsTagFocusMembers,
  AccountDiscountList,
  AccountChanceList,
  AccountGrowth,
  AccountExpertpilot,
  Accountfocus,
  AccountpublishpublishAnswers,
  AccountpublishpublishQuestions,
  AccountpublishpublishArticle,
  AccountpublishpublishComment,
  AccountArticleList,
  AccountDynamicList,
  Accountinfo,
  AccountResume,
  Accountinfosjob,
  Accountinfosproject,
  Accountinfosedu,
  Accountinfosedus,
  Accountinfosjobs,
  Accountinfosprojects,
  Accountinfostrains,
  componentsPageTransition,
  Accountinfosbasic,
  Accountinfosbasicdescription,
  Accountinfosbasicname,
  Accountinfosbasicaddress,
  Accountinfosbasiccompany,
  Accountinfosbasicposition,
  Accountinfosbasicemail,
  Accountinfosprivacy,
  Accountinfostrain,
  Financeinfo,
  Financelist,
  Financewithdraw,
  Financesetting,
  TagsindustryTagsIndexedlist,
  Expertindex,
  Expertapply,
  ExpertapplySuccess,
  Expertrecommend,
  AskAsk,
  AskAskInteraction,
  PayAskSuccess,
  PayPaySuccess,
  AskAskSuccess,
  AskAskType,
  TaskTaskListSub,
  TaskInformList,
  TaskTaskbar,
  Taskreadbar,
  Taskinformbar,
  Taskintegralbar,
  Taskbalancebar,
  Taskchat,
  AskAskDetail,
  AskAskList,
  AskAskListFinish,
  AnswerAnswerList,
  AnswerAnswerListFinished,
  AnswerAnswerDetail,
  AnswerRefuse,
  AnswerSelectTime,
  AnswerAnswer,
  AskComment,
  AccountselectHeader,
  AccountselectHeaderH5,
  AccountselectCompany,
  NearbynearbyPeople,
  NearbynearbyCompany,
  NearbynearbyPeopleMapDetail,
  NearbynearbyCompanyMapDetail,
  NearbycompanyDetails,
  UnansweredQuestions,
  SelectionRecommend,
  DiscoverAdd4,
  DiscoverAdd,
  AddressNearby,
  ReadhubReadhub,
  DiscoverComment,
  ReadhubDetailH5,
  AccountSetting,
  Guide,
  Feedback,
  About,
  SettingpushSetting,
  SettingpushSettingFollow,
  SettingpushSettingAboutMe,
  SeekingCooperation,
  Project,
  HelpAsk,
  ProjectForm,
  SelectUserSelectUsers,
  AccountcollectUser,
  AccountcollectTags,
  AccountcollectQuestion,
  CompanyMy,
  CompanyHelp,
  CompanySubmit,
  CompanySuccess,
  ActivityAsk,
  ProjectBasic,
  ProjectConcrete,
  ProjectLike,
  ProjectCompany,
  ProjectList,
  ProjectReview,
  HelpProtocol,
  HelpInvitation,
  HelpQuestion,
  WechatRegister,
  WechatInfo,
  Webviewnotice,
  WebviewVendor,
  Webviewarticle,
  WebviewShare,
  WebviewregisterForm,
  DialogList,
  ExceptionError,
  Hongbao,
  Ad,
  componentsShortTcut,
  Page404
}
