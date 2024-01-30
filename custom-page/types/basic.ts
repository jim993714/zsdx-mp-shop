export interface PageShareConfig {
    /**
     * 是否开启分享
     */
    enable: boolean;
    /**
     * 分享标题
     */
    title: string;
    /**
     * 分享描述
     */
    desc: string;
    /**
     * 分享图片
     */
    wx_mini_app_image: string;
}

export interface PageBaseConfig {
    /**
     * 标题类型 1: 文字 2: 图片
     */
    title_type: 1 | 2;
    /**
     * 页面标题 title_type = 1 时有效
     */
    title_text: string;
    /**
     * 页面标题图片 title_type = 2 时有效
     */
    title_image: string;
    /**
     * 标题栏背景色
     */
    title_background: string;
    /**
     * 图标颜色 1: 黑色 2: 白色
     */
    icon_type: 1 | 2;
    /**
     * 标题栏通栏
     */
    header_type: 'transparent' | '';
    /**
     * 页面背景色
     */
    background_color: string;

    /**
     * 分享配置
     */
    share_config: PageShareConfig;
}
