const basicService = [
  {
    name:'我的地址',
    icon:'icon-address',
    url:'/pages/center/seting/address/address',
    role:0,
    
  },
  {
    name: '联系客服',
    icon: 'icon-service',
    url: '',
    role: 0

  },
  {
    name: '企业福利',
    icon: 'icon-welfare',
    url: '/pages/center/welfareCard/welfareCard',
    role: 0

  },
  // {
  //   name: '商家入驻',
  //   icon: 'icon-business',
  //   url: '',
  //   role: 0

  // },
  
  
  
  

]

const advanceService = [
  {
    name: '业绩收入',
    icon: 'income',
    url: '/pages/member/income/income',
    role: 1

  },
  {
    name: '我的好友',
    icon: 'fans',
    url: '/pages/center/myPartner/myPartner',
    role: 0
  },
  {
    name: '商家入驻',
    icon: 'merchant',
    url: '/pages/center/merchantRegister/merchant',
    role: 0

  },
  {
    name: '邀请好友',
    icon: 'invite',
    url: '/pages/member/invite/invite',
    role: 0

  }
]

module.exports = {
  basicService,
  advanceService
}