import React from 'react'
import Footer from "../components/footer/Footer"
import DashboardBreadcrumb from '../components/breadcrumb/DashboardBreadcrumb'
import DashboardCards from '../components/cards/DashboardCards'
import SalesAnalytics from '../components/dashboard/SalesAnalytics'
import SocialVisitors from '../components/dashboard/SocialVisitors'
import NewCustomer from '../components/dashboard/NewCustomer'
import RecentOrder from '../components/dashboard/RecentOrder'
import AreaChartComponent from '../components/charts/AreaChartComponent'
const DashboardMainContent = () => {
  return (
    <div className="main-content">
        <DashboardBreadcrumb title={'eCommerce Dashboard'}/>
        <DashboardCards/>
        <div className="row">
            {/* <SalesAnalytics/> */}
            {/* <SocialVisitors/> */}
            {/* <NewCustomer/> */}
            <div className="panel-body mt-5 mb-5">
                    <div id="areaChart">
                        <AreaChartComponent/>
                    </div>
                </div>
            <RecentOrder/>

        </div>
        {/* <Footer/> */}
    </div>
  )
}

export default DashboardMainContent