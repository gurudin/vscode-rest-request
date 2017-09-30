POST http://apibi.xiaohe.com.cn/EnrollmentRate/campusRate HTTP/1.1

$header
{
    "Content-Type": "application/json",
    "cache-control": "no-cache"
}

$content
{
	"keys[timestamp]": "1234567890",
	"keys[packey]": "09d5d86558be11e7a7544439c44fda44",
	"keys[data_type]": "json",
	"data[page_infos][curr_page]": "1",
	"data[page_infos][page_size]": "10",
	"data[conditions][merchant_id]": "f09783e002ea99a1c335caf07ad921f8",
	"data[conditions][year_name]": "2017",
	"data[conditions][season_id]": "9cdea92d9cb7fb96ada1b9ae4f97e3d5",
	"data[conditions][sort]": "rate"
  }

###
PUT url HTTP/1.1

$header
{
    "header-key": "header-value"
}

$content
{
    "content-key": "content-value"
}
