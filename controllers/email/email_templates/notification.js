/**
 * [description]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
export default notification => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html><head><meta content="exported via StampReady" name="sr_export"><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="X-UA-Compatible" content="IE=edge"><style type="text/css">

      @import url('https://fonts.googleapis.com/css?family=Lato:400,700');
      @media only screen {
        th, td, div, p {font-family: 'Lato', Helvetica, Arial, sans-serif !important;}
      }

      #outlook a {padding: 0;}
      a {text-decoration: none;}
      table {border-collapse: collapse;}
      th, td, div, p {-webkit-font-smoothing: ; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; font-size: 13px; line-height: 23px;}
      img {-ms-interpolation-mode: bicubic; border: 0; display: block; height: auto; line-height: 100%; outline: none; text-decoration: none;}

      .row {
        margin: 0 auto;
        width: 700px;
      }
      .row .row {width: 100%;}

      .spacer {overflow: hidden;}
      th.menu-item {display: inline;}
      .hover-shrink:hover {transform: scale(0.7);}

      @media only screen and (max-width: 699px) {

        .wrapper {min-width: 100% !important;}
        .row {width: 90% !important;}
        .row .row {width: 100% !important;}

        .column {
          box-sizing: border-box;
          display: inline-block !important;
          width: 100% !important;
          word-break: break-word;
        }
        .mobile-1  {max-width: 8.33333%;}
        .mobile-2  {max-width: 16.66667%;}
        .mobile-3  {max-width: 25%;}
        .mobile-4  {max-width: 33.33333%;}
        .mobile-5  {max-width: 41.66667%;}
        .mobile-6  {max-width: 50%;}
        .mobile-7  {max-width: 58.33333%;}
        .mobile-8  {max-width: 66.66667%;}
        .mobile-9  {max-width: 75%;}
        .mobile-10 {max-width: 83.33333%;}
        .mobile-11 {max-width: 91.66667%;}
        .mobile-12 {
          padding-right: 30px !important;
          padding-left: 30px !important;
        }

        .mobile-offset-1  {margin-left: 8.33333% !important;}
        .mobile-offset-2  {margin-left: 16.66667% !important;}
        .mobile-offset-3  {margin-left: 25% !important;}
        .mobile-offset-4  {margin-left: 33.33333% !important;}
        .mobile-offset-5  {margin-left: 41.66667% !important;}
        .mobile-offset-6  {margin-left: 50% !important;}
        .mobile-offset-7  {margin-left: 58.33333% !important;}
        .mobile-offset-8  {margin-left: 66.66667% !important;}
        .mobile-offset-9  {margin-left: 75% !important;}
        .mobile-offset-10 {margin-left: 83.33333% !important;}
        .mobile-offset-11 {margin-left: 91.66667% !important;}

        .has-columns {
          padding-right: 20px !important;
          padding-left: 20px !important;
        }

        .has-columns .column {
          padding-right: 10px !important;
          padding-left: 10px !important;
        }

        .mobile-collapsed .column {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }

        img {
          width: 100%;
          height: auto;
        }

        .mobile-center {
          display: table !important;
          float: none;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .mobile-left {
          float: none;
          margin: 0 !important;
        }

        .mobile-text-center {text-align: center !important;}
        .mobile-text-left   {text-align: left !important;}
        .mobile-text-right  {text-align: right !important;}

        .show-on-mobile {
          display: table !important;
          overflow: visible !important;
          line-height: inherit !important;
        }

        .hide-on-mobile {
          display: none !important;
          width: 0;
          overflow: hidden;
        }

        .mobile-full-width {
          display: table;
          width: 100% !important;
        }

        .mobile-first {display: table-header-group !important;}
        .mobile-intermediate {display: table-row !important;}
        .mobile-last {display: table-footer-group !important;}

        .mobile-first th,
        .mobile-intermediate th,
        .mobile-last th {
          padding-left: 30px !important;
          padding-right: 30px !important;
        }

        .menu[align="center"],
        .menu.mobile-center {
          width: auto !important;
        }
        .menu-item,
        th.menu-item {
          width: auto !important;
          display: inline-block !important;
          padding: 0 10px 0 !important;
        }
        .menu.mobile-vertical .menu-item {
          display: block !important;
          padding: 0 0 15px 0 !important;
        }

        .hamburger-menu,
        .accordion-content {
          max-height: 0;
          overflow: hidden;
          -ms-transition: max-height .25s linear;
          -webkit-transition: max-height .25s linear;
          transition: max-height .25s linear;
        }
        .menu-trigger img {
          display: block;
          margin: 0 auto !important;
          float: none !important;
          max-height: none !important;
        }
        .menu-trigger:hover + .hamburger-menu,
        .hamburger-menu:hover {max-height: 300px;}
        .accordion-item:hover .accordion-content {max-height: 999px;}

        u ~ div .wrapper .menu-trigger img {display: none;}
        u ~ div .wrapper .hamburger-menu {max-height: none; padding-top: 15px;}
        u ~ div .wrapper .accordion-content {max-height: none;}
        u ~ div .wrapper .menu .menu-item {
          display: inline-block !important;
          padding: 0 10px !important;
        }

        .h1 {font-size: 42px !important;}
        .h2 {font-size: 28px !important;}
        .h3 {font-size: 16px !important;}

        .spacer                     {height: 30px; line-height: 100% !important; font-size: 100% !important;}
        .divider th                 {height: 60px;}
        .mobile-padding-top         {padding-top: 30px !important;}
        .mobile-padding-top-mini    {padding-top: 10px !important;}
        .mobile-padding-bottom      {padding-bottom: 30px !important;}
        .mobile-padding-bottom-mini {padding-bottom: 10px !important;}
        .mobile-margin-top          {margin-top: 30px !important;}
        .mobile-margin-top-mini     {margin-top: 10px !important;}
        .mobile-margin-bottom       {margin-bottom: 30px !important;}
        .mobile-margin-bottom-mini  {margin-bottom: 10px !important;}
        .no-border-on-mobile        {border: none !important;}

        .overlay-bg {
           background: #232323;
           background: url(images/overlay-dark.png);
           background: rgba(0,0,0,0.4);
        }
      }
    </style></head><body>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               <table class="wrapper" style="min-width: 700px;" data-module="Header Centered No Menu" data-thumb="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2017/07/10/59ow3FOJGzfIKxpRNDVYMQqZ/notifications/thumbnails/header-centered-no-menu.jpg" data-bgcolor="Outer Background Colour" align="center" width="100%" cellspacing="0" cellpadding="0" bgcolor="#EEEEEE">
       <tr>
         <td>
           <table class="row" data-bgcolor="Inner Background Colour" align="center" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF">
             <tr>
               <td class="spacer" style="font-size: 40px; line-height: 40px; mso-line-height-rule: exactly;" height="40">
&nbsp;</td>
             </tr>
             <tr>
               <th class="column" style="padding-left: 30px; padding-right: 30px;" width="640">
                 <center>
                   <a href="https://swmp.app" target="_blank">
                     <img src="http://www.stampready.net/dashboard/editor/user_uploads/image_uploads/2018/07/17/ksPwgQNfVpj26bWR08DZ7yd31qBHXCnz.png" style="border: 0; margin: 0 auto; width: 100%; max-width: 130px;" width="130">
                   </a>
                 </center>
               </th>
             </tr>
             <tr>
               <td class="spacer" style="font-size: 40px; line-height: 40px; mso-line-height-rule: exactly;" height="40">
&nbsp;</td>
             </tr>
           </table>
         </td>
       </tr>
     </table>
<table class="wrapper" align="center" bgcolor="#EEEEEE" cellpadding="0" cellspacing="0" width="100%" style="min-width: 700px;" data-module="Abandoned Cart Intro" data-thumb="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2017/07/10/59ow3FOJGzfIKxpRNDVYMQqZ/notifications/thumbnails/notification-abandoned-cart-message.jpg" data-bgcolor="Outer Background Colour">
       <tr>
         <td>
           <table class="row" align="center" bgcolor="#F4F4F4" cellpadding="0" cellspacing="0" data-bgcolor="Inner Background Colour">
             <tr>
               <td class="spacer" height="40" style="font-size: 40px; line-height: 40px; mso-line-height-rule: exactly;">
&nbsp;</td>
             </tr>
             <tr valign="top" style="vertical-align: top;">
               <th class="column mobile-12" width="640" style="padding-left: 30px; padding-right: 30px; color: #232323; font-weight: 400; text-align: left;">
                 <div style="font-size: 28px; font-weight: 700; line-height: 30px; margin-bottom: 30px;" data-color="Title" data-size="Title Size">
${notification.title}</div>
                 <div style="color: #666666; font-size: 18px;" data-color="Text" data-size="Text Size">
${notification.message}</div>
               </th>
             </tr>
             <tr>
               <td class="spacer" height="40" style="font-size: 40px; line-height: 40px; mso-line-height-rule: exactly;">
&nbsp;</td>
             </tr>
           </table>
         </td>
       </tr>
     </table>
<table class="wrapper" style="min-width: 700px;" data-module="Footer 6 Left" data-bgcolor="Outer Background Colour" align="center" width="100%" cellspacing="0" cellpadding="0" bgcolor="#EEEEEE">
    <tr>
      <td>
        <table class="row" data-bgcolor="Inner Background Colour" align="center" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF">
          <tr>
            <td class="spacer" colspan="2" style="font-size: 40px; line-height: 40px; mso-line-height-rule: exactly;" height="40">
              &nbsp;            </td>
          </tr>
          <tr style="vertical-align: top;" valign="top">
            <th class="column mobile-12 mobile-padding-bottom-mini" style="padding-left: 30px; padding-right: 10px; text-align: left;" width="200">
               <a href="http://example.com" target="_blank" class="mobile-center">
<img src="http://www.stampready.net/dashboard/editor/user_uploads/image_uploads/2018/07/17/ltFgZjPf1ky0RvWzcGBsS68xhVd7mYr3.png" alt="Footer Logo" style="border: 0; display: inline-block; width: 100%; max-width: 130px;" width="130">
</a>
            </th>
            <th class="column mobile-12 mobile-text-center" style="padding-left: 10px; padding-right: 30px; color: #666666; font-weight: 400; text-align: right;" width="420">
              <div data-color="Copyright" data-size="Copyright Size" style="font-size: 12px; line-height: 20.4px;">
                © Strategic WMP. All Rights Reserved.               </div>
              <div style="margin-bottom: 10px;" data-link-style="color: #666666; text-decoration: none;">
<br>
</div>
</th>
</tr>
</table>
      </td>
    </tr>
  </table>
                                                            </body></html>`
}
