import scrapy

class brickzSpider(scrapy.Spider):
    name = 'land'

    start_urls = [
        'https://www.brickz.my/transactions/land/selangor/ampang/?range=2001+Aug-',
        'https://www.brickz.my/transactions/land/selangor/balakong/?range=1999+Sep-',
        'https://www.brickz.my/transactions/land/selangor/batu-arang/?range=2001+Aug-',
        'https://www.brickz.my/transactions/land/selangor/beranang/?range=1996+Aug-',
        'https://www.brickz.my/transactions/land/selangor/gombak/?range=1992+Nov-',
        'https://www.brickz.my/transactions/land/selangor/kajang/?range=1995+Mar-',
        'https://www.brickz.my/transactions/land/selangor/klang/?range=1982+Aug-',
        'https://www.brickz.my/transactions/land/selangor/petaling-jaya/?range=2004+Aug-',
        'https://www.brickz.my/transactions/land/selangor/rawang/?range=1988+Dec-',
        'https://www.brickz.my/transactions/land/selangor/selayang/?range=2003+Apr-',
        'https://www.brickz.my/transactions/land/selangor/semenyih/?range=1992+Sep-',
        'https://www.brickz.my/transactions/land/selangor/serendah/?range=1991+Oct-',
        'https://www.brickz.my/transactions/land/selangor/shah-alam/?range=1979+Aug-',
        'https://www.brickz.my/transactions/land/selangor/subang-jaya/?range=1991+Mar-'
    ]

    def parse(self, response):
        pages = response.css("div.ptd_table_toolbar div.pagination select.pagination_select option").extract()
        count = 0
        for page in pages:  # pagination
            count = count + 1
            url_list = response.url.split('/')
            redirect_to = '/'.join(url_list[0:-1]) + '/page/' + str(count) + '/' + url_list[-1]
            print("redirect_addr: " + redirect_to)
            self.start_urls.append(redirect_to)

        for url in self.start_urls:
            yield scrapy.Request(url, callback=self.parse_page)

    def parse_page(self, response):
        subareas_url = response.xpath("//table[@id='ptd_list_table']//tr//td[1]//@href").extract()

        for subarea_url in subareas_url:
            url = response.urljoin(subarea_url)
            yield scrapy.Request(url, callback=self.parse_table)

    def parse_table(self, response):
        lands = response.xpath("//table[@id='ptd_list_detail_table']//tr")
        count = 1
        print('inside parse1')
        for land in lands:
            sel = "//tr[%d]" % count
            print(sel)
            date = land.xpath(sel+"//td[1]/text()").extract_first()
            address = land.xpath(sel+"//td[2]/text()").extract_first()
            buildingType = land.xpath(sel+"//td[3]/text()").extract_first()
            landArea = land.xpath(sel + "//td[6]/text()").extract_first()
            builtUp = land.xpath(sel + "//td[7]/text()").extract_first()
            pricePsf = land.xpath(sel + "//td[8]/text()").extract_first()
            price = land.xpath(sel + "//td[9]/text()").extract_first()
            print(count)

            count = count + 1

            yield {
                'City': response.url.split("/")[-4],
                'SubArea': response.url.split("/")[-3],
                'Date': date,
                'Address': address,
                'BuildingType': buildingType,
                'LandArea': landArea,
                'BuiltUp': builtUp,
                'PricePsf': pricePsf,
                'Price': price
            }
