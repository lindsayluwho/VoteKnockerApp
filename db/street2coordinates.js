<script language="JavaScript">

var nl = getNewLine()

function getNewLine() {
	var agent = navigator.userAgent

	if (agent.indexOf("Win") >= 0)
		return "\r\n"
	else
		if (agent.indexOf("Mac") >= 0)
			return "\r"

 	return "\r"

}

pagecode = 'require \'rubygems\''+nl+nl+
	'require \'json\''+nl+nl+
	'# A horrible hack to work around my problems getting the Geocoder to install as a gem'+nl+
	'$LOAD_PATH.unshift \'../geocoder/lib\''+nl+
	'require \'geocoder/us/database\''+nl+nl+
	'# Some hackiness to include the library script, even if invoked from another directory'+nl+
	'cwd = File.expand_path(File.dirname(__FILE__))'+nl+
	'require File.join(cwd, \'dstk_config\')'+nl+
	'require File.join(cwd, \'geodict_lib\')'+nl+nl+nl+
	'# Keep a singleton accessor for the geocoder object, so we don\'t leak resources'+nl+
	'# Fix for https://github.com/petewarden/dstk/issues/4'+nl+
	'$geocoder_db = nil'+nl+nl+
	'S2C_WHITESPACE = \'(([ \\t.,;]+)|^|$)\''+nl+nl+
	'def s2c_debug_log(message)'+nl+
	'#  printf(STDERR, "%s\\n" % message)'+nl+
	'end'+nl+nl+
	'# Takes an array of postal addresses as input, and looks up their locations using'+nl+
	'# data from the US census'+nl+
	'def street2coordinates(addresses)'+nl+nl+
	'  if !$geocoder_db'+nl+
	'    db_file = nil'+nl+
	'    DSTKConfig::GEOCODER_DB_FILES.each do |file|'+nl+
	'      if File.exists?(file)'+nl+
	'        db_file = file'+nl+
	'        break'+nl+
	'      end'+nl+
	'    end'+nl+
	'    if !db_file'+nl+
	'      raise "street2coordinates(): Couldn\'t find any geocoder database files"'+nl+
	'    end'+nl+
	'    $geocoder_db = Geocoder::US::Database.new(db_file, {:debug => false})'+nl+
	'  end'+nl+nl+
	'  default_country = guess_top_country_for_list(addresses)'+nl+nl+
	'  output = {}'+nl+
	'  addresses.each do |address|'+nl+
	'    begin'+nl+
	'      country = guess_country_for_address(address) or default_country'+nl+
	'      if country == \'us\''+nl+
	'        info = geocode_us_address(address)'+nl+
	'      elsif country == \'uk\''+nl+
	'        info = geocode_uk_address(address)'+nl+
	'      else'+nl+
	'        info = nil'+nl+
	'      end'+nl+
	'    rescue'+nl+
	'      printf(STDERR, $!.inspect + $@.inspect + "\\n")'+nl+
	'      info = nil'+nl+
	'    end'+nl+
	'    output[address] = info'+nl+
	'  end'+nl+
	'    '+nl+
	'  return output'+nl+nl+
	'end'+nl+nl+
	'# Looks through the list of addresses, tries to guess which country each one belongs to'+nl+
	'# by looking for evidence like explicit country names, distinctive postal codes or '+nl+
	'# known region or city names, and returns the most frequent for use as a default. '+nl+
	'def guess_top_country_for_list(addresses)'+nl+nl+
	'  country_votes = {}'+nl+
	'  addresses.each do |address|'+nl+
	'  '+nl+
	'    country = guess_country_for_address(address)'+nl+nl+
	'    if country'+nl+
	'      if !country_votes.has_key?(country)'+nl+
	'        country_votes[country] = 0'+nl+
	'      end'+nl+
	'      country_votes[country] += 1'+nl+
	'    end'+nl+
	'  '+nl+
	'  end'+nl+
	'  '+nl+
	'  if country_votes.length == 0'+nl+
	'    return nil'+nl+
	'  end'+nl+
	'  '+nl+
	'  top_countries = country_votes.sort do |a,b| b[1]<=>a[1] end'+nl+
	'  top_country = top_countries[0][0]'+nl+nl+
	'  top_country'+nl+
	'  '+nl+
	'end'+nl+nl+
	'# Looks for clues in the address that indicate which country it\'s in'+nl+
	'def guess_country_for_address(address)'+nl+nl+
	'  if looks_like_us_address(address)'+nl+
	'    return \'us\''+nl+
	'  end'+nl+nl+
	'  if looks_like_uk_address(address)'+nl+
	'    return \'uk\''+nl+
	'  end'+nl+nl+
	'  return nil'+nl+
	'end'+nl+nl+
	'# Searches for either explicit country name, or a known state followed by a zip code'+nl+
	'def looks_like_us_address(address)'+nl+nl+
	'  country_names = \'(U\\.?S\\.?A?\\.?|United States|America)\''+nl+
	'  country_names_suffix_re = Regexp.new(S2C_WHITESPACE+country_names+S2C_WHITESPACE+\'?$\', Regexp::IGNORECASE)'+nl+nl+
	'  if country_names_suffix_re.match(address)'+nl+
	'    return true'+nl+
	'  end'+nl+nl+
	'  state_names_list = ['+nl+
	'    \'AK\','+nl+
	'    \'Alaska\','+nl+
	'    \'AL\','+nl+
	'    \'Alabama\','+nl+
	'    \'AR\','+nl+
	'    \'Arkansas\','+nl+
	'    \'AZ\','+nl+
	'    \'Arizona\','+nl+
	'    \'CA\','+nl+
	'    \'California\','+nl+
	'    \'CO\','+nl+
	'    \'Colorado\','+nl+
	'    \'CT\','+nl+
	'    \'Connecticut\','+nl+
	'    \'DE\','+nl+
	'    \'Delaware\','+nl+
	'    \'DC\','+nl+
	'    \'District of Columbia\','+nl+
	'    \'FL\','+nl+
	'    \'Florida\','+nl+
	'    \'GA\','+nl+
	'    \'Georgia\','+nl+
	'    \'HI\','+nl+
	'    \'Hawaii\','+nl+
	'    \'ID\','+nl+
	'    \'Idaho\','+nl+
	'    \'IL\','+nl+
	'    \'Illinois\','+nl+
	'    \'IN\','+nl+
	'    \'Indiana\','+nl+
	'    \'IA\','+nl+
	'    \'Iowa\','+nl+
	'    \'KS\','+nl+
	'    \'Kansas\','+nl+
	'    \'KY\','+nl+
	'    \'Kentucky\','+nl+
	'    \'LA\','+nl+
	'    \'Louisiana\','+nl+
	'    \'ME\','+nl+
	'    \'Maine\','+nl+
	'    \'MD\','+nl+
	'    \'Maryland\','+nl+
	'    \'MA\','+nl+
	'    \'Massachusetts\','+nl+
	'    \'MI\','+nl+
	'    \'Michigan\','+nl+
	'    \'MN\','+nl+
	'    \'Minnesota\','+nl+
	'    \'MS\','+nl+
	'    \'Mississippi\','+nl+
	'    \'MO\','+nl+
	'    \'Missouri\','+nl+
	'    \'MT\','+nl+
	'    \'Montana\','+nl+
	'    \'NE\','+nl+
	'    \'Nebraska\','+nl+
	'    \'NV\','+nl+
	'    \'Nevada\','+nl+
	'    \'NH\','+nl+
	'    \'New Hamp(shire)?\','+nl+
	'    \'NJ\','+nl+
	'    \'New Jersey\','+nl+
	'    \'NM\','+nl+
	'    \'New Mexico\','+nl+
	'    \'NY\','+nl+
	'    \'New York\','+nl+
	'    \'NC\','+nl+
	'    \'North Carolina\','+nl+
	'    \'ND\','+nl+
	'    \'North Dakota\','+nl+
	'    \'OH\','+nl+
	'    \'Ohio\','+nl+
	'    \'OK\','+nl+
	'    \'Oklahoma\','+nl+
	'    \'OR\','+nl+
	'    \'Oregon\','+nl+
	'    \'PA\','+nl+
	'    \'Pennsylvania\','+nl+
	'    \'RI\','+nl+
	'    \'Rhode Island\','+nl+
	'    \'SC\','+nl+
	'    \'South Carolina\','+nl+
	'    \'SD\','+nl+
	'    \'South Dakota\','+nl+
	'    \'TN\','+nl+
	'    \'Tennessee\','+nl+
	'    \'TX\','+nl+
	'    \'Texas\','+nl+
	'    \'UT\','+nl+
	'    \'Utah\','+nl+
	'    \'VT\','+nl+
	'    \'Vermont\','+nl+
	'    \'VA\','+nl+
	'    \'Virginia\','+nl+
	'    \'WA\','+nl+
	'    \'Washington\','+nl+
	'    \'WV\','+nl+
	'    \'West Virginia\','+nl+
	'    \'WI\','+nl+
	'    \'Wisconsin\','+nl+
	'    \'WY\','+nl+
	'    \'Wyoming\','+nl+
	'  ]'+nl+
	'  '+nl+
	'  state_names = \'(\'+state_names_list.join(\'|\')+\')\''+nl+
	'  '+nl+
	'  zip_code = \'\\d\\d\\d\\d\\d(-\\d\\d\\d\\d)?\''+nl+
	'  '+nl+
	'  state_zip_suffix_re = Regexp.new(S2C_WHITESPACE+state_names+\'(\'+S2C_WHITESPACE+zip_code+\')?\'+S2C_WHITESPACE+\'?$\', Regexp::IGNORECASE)'+nl+
	'  '+nl+
	'  if state_zip_suffix_re.match(address)'+nl+
	'    return true'+nl+
	'  end'+nl+nl+
	'  return false'+nl+
	'end'+nl+nl+
	'# Looks for a country name, county name, or something that looks like a post code'+nl+
	'def looks_like_uk_address(address)'+nl+nl+
	'  country_names = \'(U\\.?K\\.?|United Kingdom|Great Britain|England|Scotland|Wales)\''+nl+
	'  country_names_suffix_re = Regexp.new(S2C_WHITESPACE+country_names+S2C_WHITESPACE+\'?$\', Regexp::IGNORECASE)'+nl+nl+
	'  if country_names_suffix_re.match(address)'+nl+
	'    return true'+nl+
	'  end'+nl+nl+
	'  county_names_list = ['+nl+
	'    \'aberdeen(shire)?\','+nl+
	'    \'abertawe\','+nl+
	'    \'angus\','+nl+
	'    \'argyll and bute\','+nl+
	'    \'ayr(shire)?\','+nl+
	'    \'barnsley\','+nl+
	'    \'bedford\','+nl+
	'    \'bedford(shire)?\','+nl+
	'    \'berk(shire)?\','+nl+
	'    \'birmingham\','+nl+
	'    \'blackpool\','+nl+
	'    \'blaenau gwent\','+nl+
	'    \'bolton\','+nl+
	'    \'bournemouth\','+nl+
	'    \'bracknell forest\','+nl+
	'    \'bradford\','+nl+
	'    \'bridgend\','+nl+
	'    \'brighton and hove\','+nl+
	'    \'bristol\','+nl+
	'    \'bro morgannwg\','+nl+
	'    \'buckingham(shire)?\','+nl+
	'    \'bury\','+nl+
	'    \'caerdydd\','+nl+
	'    \'caerffili\','+nl+
	'    \'caerphilly\','+nl+
	'    \'calderdale\','+nl+
	'    \'cambridge(shire)?\','+nl+
	'    \'cardiff\','+nl+
	'    \'carmarthen(shire)?\','+nl+
	'    \'casnewydd\','+nl+
	'    \'castell-nedd port talbot\','+nl+
	'    \'central bedford(shire)?\','+nl+
	'    \'ceredigion\','+nl+
	'    \'che(shire)?\','+nl+
	'    \'clackmannan(shire)?\','+nl+
	'    \'conwy\','+nl+
	'    \'cornwall\','+nl+
	'    \'county durham\','+nl+
	'    \'coventry\','+nl+
	'    \'cumbria\','+nl+
	'    \'darlington\','+nl+
	'    \'denbigh(shire)?\','+nl+
	'    \'derby\','+nl+
	'    \'derby(shire)?\','+nl+
	'    \'devon\','+nl+
	'    \'doncaster\','+nl+
	'    \'dorset\','+nl+
	'    \'dudley\','+nl+
	'    \'dumfries and galloway\','+nl+
	'    \'dunbarton(shire)?\','+nl+
	'    \'dundee city\','+nl+
	'    \'durham\','+nl+
	'    \'edinburgh\','+nl+
	'    \'eilean siar\','+nl+
	'    \'essex\','+nl+
	'    \'falkirk\','+nl+
	'    \'fife\','+nl+
	'    \'flint(shire)?\','+nl+
	'    \'gateshead\','+nl+
	'    \'glasgow\','+nl+
	'    \'gloucester(shire)?\','+nl+
	'    \'greater manchester\','+nl+
	'    \'gwynedd\','+nl+
	'    \'halton\','+nl+
	'    \'hamp(shire)?\','+nl+
	'    \'hartlepool\','+nl+
	'    \'hereford(shire)?\','+nl+
	'    \'hertford(shire)?\','+nl+
	'    \'highland\','+nl+
	'    \'inverclyde\','+nl+
	'    \'isle of anglesey\','+nl+
	'    \'isle of wight\','+nl+
	'    \'isles of scilly\','+nl+
	'    \'kent\','+nl+
	'    \'kingston upon hull\','+nl+
	'    \'kirklees\','+nl+
	'    \'knowsley\','+nl+
	'    \'lanark(shire)?\','+nl+
	'    \'lanca(shire)?\','+nl+
	'    \'leeds\','+nl+
	'    \'leicester\','+nl+
	'    \'leicester(shire)?\','+nl+
	'    \'lincoln(shire)?\','+nl+
	'    \'liverpool\','+nl+
	'    \'london\','+nl+
	'    \'lothian\','+nl+
	'    \'luton\','+nl+
	'    \'manchester\','+nl+
	'    \'medway\','+nl+
	'    \'merseyside\','+nl+
	'    \'merthyr tudful\','+nl+
	'    \'merthyr tydfil\','+nl+
	'    \'middlesbrough\','+nl+
	'    \'midlands\','+nl+
	'    \'midlothian\','+nl+
	'    \'milton keynes\','+nl+
	'    \'monmouth(shire)?\','+nl+
	'    \'moray\','+nl+
	'    \'na h-eileanan an iar\','+nl+
	'    \'neath port talbot\','+nl+
	'    \'newcastle upon tyne\','+nl+
	'    \'newport\','+nl+
	'    \'norfolk\','+nl+
	'    \'northampton(shire)?\','+nl+
	'    \'northumberland\','+nl+
	'    \'nottingham\','+nl+
	'    \'nottingham(shire)?\','+nl+
	'    \'oldham\','+nl+
	'    \'orkney islands\','+nl+
	'    \'oxford(shire)?\','+nl+
	'    \'pembroke(shire)?\','+nl+
	'    \'pen-y-bont ar ogwr\','+nl+
	'    \'perth and kinross\','+nl+
	'    \'peterborough\','+nl+
	'    \'plymouth\','+nl+
	'    \'poole\','+nl+
	'    \'portsmouth\','+nl+
	'    \'powys\','+nl+
	'    \'reading\','+nl+
	'    \'redcar and cleveland\','+nl+
	'    \'renfrew(shire)?\','+nl+
	'    \'rhondda cynon taff?\','+nl+
	'    \'rochdale\','+nl+
	'    \'rotherham\','+nl+
	'    \'rutland\','+nl+
	'    \'salford\','+nl+
	'    \'sandwell\','+nl+
	'    \'scottish borders\','+nl+
	'    \'sefton\','+nl+
	'    \'sheffield\','+nl+
	'    \'shetland islands\','+nl+
	'    \'shrop(shire)?\','+nl+
	'    \'sir benfro\','+nl+
	'    \'sir ceredigion\','+nl+
	'    \'sir ddinbych\','+nl+
	'    \'sir fynwy\','+nl+
	'    \'sir gaerfyrddin\','+nl+
	'    \'sir y fflint\','+nl+
	'    \'sir ynys mon\','+nl+
	'    \'slough\','+nl+
	'    \'solihull\','+nl+
	'    \'somerset\','+nl+
	'    \'southampton\','+nl+
	'    \'southend-on-sea\','+nl+
	'    \'st helens\','+nl+
	'    \'stafford(shire)?\','+nl+
	'    \'stirling\','+nl+
	'    \'stockport\','+nl+
	'    \'stockton-on-tees\','+nl+
	'    \'stoke-on-trent\','+nl+
	'    \'suffolk\','+nl+
	'    \'sunderland\','+nl+
	'    \'surrey\','+nl+
	'    \'sussex\','+nl+
	'    \'swansea\','+nl+
	'    \'swindon\','+nl+
	'    \'tameside\','+nl+
	'    \'telford and wrekin\','+nl+
	'    \'thurrock\','+nl+
	'    \'tor-faen\','+nl+
	'    \'torbay\','+nl+
	'    \'torfaen\','+nl+
	'    \'trafford\','+nl+
	'    \'tyne and wear\','+nl+
	'    \'tyneside\','+nl+
	'    \'vale of glamorgan\','+nl+
	'    \'wakefield\','+nl+
	'    \'walsall\','+nl+
	'    \'warrington\','+nl+
	'    \'warwick(shire)?\','+nl+
	'    \'wigan\','+nl+
	'    \'wilt(shire)?\','+nl+
	'    \'windsor and maidenhead\','+nl+
	'    \'wirral\','+nl+
	'    \'wokingham\','+nl+
	'    \'wolverhampton\','+nl+
	'    \'worcester(shire)?\','+nl+
	'    \'wrecsam\','+nl+
	'    \'wrexham\','+nl+
	'    \'york\','+nl+
	'    \'york(shire)?\','+nl+
	'  ]'+nl+
	'  '+nl+
	'  county_names = \'(\'+county_names_list.join(\'|\')+\')\'  '+nl+
	'  county_suffix_re = Regexp.new(S2C_WHITESPACE+county_names+S2C_WHITESPACE+\'?$\', Regexp::IGNORECASE)  '+nl+
	'  if county_suffix_re.match(address)'+nl+
	'    return true'+nl+
	'  end'+nl+nl+
	'  post_code = \'[A-Z][A-Z]?[0-9R][0-9A-Z]? ?[0-9][A-Z]{2}\''+nl+
	'  '+nl+
	'  post_code_suffix_re = Regexp.new(S2C_WHITESPACE+post_code+S2C_WHITESPACE+\'?$\', Regexp::IGNORECASE)  '+nl+
	'  if post_code_suffix_re.match(address)'+nl+
	'    return true'+nl+
	'  end'+nl+nl+
	'  return false'+nl+
	'end'+nl+nl+
	'# Does the actual conversion of the US address string into coordinates'+nl+
	'def geocode_us_address(address)'+nl+nl+
	'  country_names = \'(U\\.?S\\.?A?\\.?|United States|America)\''+nl+
	'  country_names_suffix_re = Regexp.new(S2C_WHITESPACE+country_names+S2C_WHITESPACE+\'?$\', Regexp::IGNORECASE)'+nl+
	'  countryless_address = address.gsub(country_names_suffix_re, \'\')'+nl+nl+
	'  locations = $geocoder_db.geocode(countryless_address, true)'+nl+
	'  if locations and locations.length>0'+nl+
	'    location = locations[0]'+nl+
	'    if location[:number] and location[:street]'+nl+
	'      street_address = location[:number]+\' \'+location[:street]'+nl+
	'    else'+nl+
	'      street_address = \'\''+nl+
	'    end'+nl+
	'    info = {'+nl+
	'      :latitude => location[:lat],'+nl+
	'      :longitude => location[:lon],'+nl+
	'      :country_code => \'US\','+nl+
	'      :country_code3 => \'USA\','+nl+
	'      :country_name => \'United States\','+nl+
	'      :region => location[:state],'+nl+
	'      :locality => location[:city],'+nl+
	'      :street_address => street_address,'+nl+
	'      :street_number => location[:number],'+nl+
	'      :street_name => location[:street],'+nl+
	'      :confidence => location[:score],'+nl+
	'      :fips_county => location[:fips_county]'+nl+
	'    }'+nl+
	'  else'+nl+
	'    info = nil'+nl+
	'  end'+nl+
	'  '+nl+
	'  info'+nl+
	'end'+nl+nl+
	'# Does the actual conversion of the UK address string into coordinates'+nl+
	'def geocode_uk_address(address)'+nl+nl+
	'  whitespace_re = Regexp.new(S2C_WHITESPACE)'+nl+
	'  clean_address = address.gsub(whitespace_re, \' \')'+nl+nl+
	'  s2c_debug_log("clean_address=\'%s\'" % clean_address.inspect)'+nl+nl+
	'  post_code_re = Regexp.new(\'( |^)([A-Z][A-Z]?[0-9R][0-9A-Z]?) ?([0-9][A-Z]{2})( |$)\', Regexp::IGNORECASE)'+nl+
	'  s2c_debug_log("post_code_re=\'%s\'" % post_code_re.inspect)'+nl+
	'  post_code_match = post_code_re.match(clean_address)'+nl+
	'  s2c_debug_log("post_code_match=\'%s\'" % post_code_match.inspect)'+nl+
	'  if post_code_match'+nl+
	'  '+nl+
	'    clean_address = clean_address[0..post_code_match.begin(0)]'+nl+
	'  '+nl+
	'    # Right-pad it with spaces to match the database format'+nl+
	'    first_part = post_code_match[2].to_s.ljust(4, \' \')'+nl+
	'    second_part = post_code_match[3].to_s'+nl+
	'    '+nl+
	'    full_post_code = first_part+second_part'+nl+
	'  '+nl+
	'    post_code_select = \'SELECT postcode,country_code,county_code,district_code,ward_code\'+'+nl+
	'      \',ST_Y(location::geometry) as latitude, ST_X(location::geometry) AS longitude\'+'+nl+
	'      \' FROM "uk_postcodes" WHERE postcode=\\\'\'+full_post_code+\'\\\' LIMIT 1;\''+nl+nl+
	'    s2c_debug_log("post_code_select=\'%s\'" % post_code_select)'+nl+nl+
	'    post_code_hashes = select_as_hashes(post_code_select, DSTKConfig::REVERSE_GEO_DATABASE)'+nl+nl+
	'    s2c_debug_log("post_code_hashes=\'%s\'" % post_code_hashes.inspect)'+nl+
	'  '+nl+
	'    if post_code_hashes and post_code_hashes.length>0'+nl+
	'    '+nl+
	'      post_code_info = post_code_hashes[0]'+nl+nl+
	'      district_code = post_code_info[\'county_code\']+post_code_info[\'district_code\']'+nl+
	'      district_select = \'SELECT * FROM uk_district_names WHERE district_code=\\\'\'+district_code+\'\\\';\''+nl+
	'      s2c_debug_log("district_select=\'%s\'" % district_select.inspect)'+nl+
	'      district_hashes = select_as_hashes(district_select, DSTKConfig::REVERSE_GEO_DATABASE)'+nl+
	'      s2c_debug_log("district_hashes=\'%s\'" % district_hashes.inspect)'+nl+
	'      district_info = district_hashes[0]'+nl+
	'      district_name = district_info[\'name\']'+nl+
	'      '+nl+
	'      ward_code = district_code+post_code_info[\'ward_code\']'+nl+
	'      ward_select = \'SELECT * FROM uk_ward_names WHERE ward_code=\\\'\'+ward_code+\'\\\';\''+nl+
	'      s2c_debug_log("ward_select=\'%s\'" % ward_select.inspect)'+nl+
	'      ward_hashes = select_as_hashes(ward_select, DSTKConfig::REVERSE_GEO_DATABASE)'+nl+
	'      s2c_debug_log("ward_hashes=\'%s\'" % ward_hashes.inspect)'+nl+
	'      ward_info = ward_hashes[0]'+nl+
	'      ward_name = ward_info[\'name\']'+nl+
	'      '+nl+
	'      info = {'+nl+
	'        :latitude => post_code_info[\'latitude\'],'+nl+
	'        :longitude => post_code_info[\'longitude\'],'+nl+
	'        :country_code => \'UK\','+nl+
	'        :country_code3 => \'GBR\','+nl+
	'        :country_name => \'United Kingdom\','+nl+
	'        :region => district_name,'+nl+
	'        :locality => ward_name,'+nl+
	'        :street_address => nil,'+nl+
	'        :street_number => nil,'+nl+
	'        :street_name => nil,'+nl+
	'        :confidence => 9,'+nl+
	'        :fips_county => nil'+nl+
	'      }'+nl+nl+
	'      s2c_debug_log("Updating info to \'%s\' for \'%s\'" % [info.inspect, full_post_code])'+nl+
	'            '+nl+
	'    end'+nl+
	'    '+nl+
	'  end'+nl+nl+
	'  clean_address.gsub!(/ (U\\.?K\\.?|United Kingdom|Great Britain|England|Scotland|Wales) *$/i, \'\')'+nl+nl+
	'  s2c_debug_log("clean_address=\'%s\'" % clean_address.inspect)'+nl+
	'  '+nl+
	'  # See if we can break up the address into obvious street and other sections'+nl+
	'  street_markers_list = ['+nl+
	'    \'Way\','+nl+
	'    \'Street\','+nl+
	'    \'St\','+nl+
	'    \'Drive\','+nl+
	'    \'Dr\','+nl+
	'    \'Avenue\','+nl+
	'    \'Ave\','+nl+
	'    \'Av\','+nl+
	'    \'Court\','+nl+
	'    \'Ct\','+nl+
	'    \'Terrace\','+nl+
	'    \'Road\','+nl+
	'    \'Rd\','+nl+
	'    \'Lane\','+nl+
	'    \'Ln\','+nl+
	'    \'Place\','+nl+
	'    \'Pl\','+nl+
	'    \'Boulevard\','+nl+
	'    \'Blvd\','+nl+
	'    \'Highway\','+nl+
	'    \'Hwy\','+nl+
	'    \'Crescent\','+nl+
	'    \'Row\','+nl+
	'    \'Rw\','+nl+
	'    \'Mews\','+nl+
	'  ]'+nl+
	'  '+nl+
	'  street_marker = \'(\'+street_markers_list.join(\'|\')+\')\''+nl+nl+
	'  street_parts_re = Regexp.new(\'^(.*[a-z]+.*\'+street_marker+\')(.*)\', Regexp::IGNORECASE)'+nl+
	'  street_parts_match = street_parts_re.match(clean_address)'+nl+
	'  s2c_debug_log("street_parts_match=\'%s\'" % street_parts_match.inspect)'+nl+
	'  if street_parts_match'+nl+
	'    street_string = street_parts_match[1]'+nl+
	'    place_string = street_parts_match[3]'+nl+
	'  else'+nl+
	'    street_string = nil'+nl+
	'    place_string = clean_address'+nl+
	'  end'+nl+
	'  '+nl+
	'  # Now try to extract the village/town/county parts'+nl+
	'  # See http://wiki.openstreetmap.org/wiki/Key:place'+nl+
	'  place_ranking = {'+nl+
	'    \'county\' => 0,'+nl+
	'    \'island\' => 1,'+nl+
	'    \'city\' => 2,'+nl+
	'    \'town\' => 3,'+nl+
	'    \'suburb\' => 4,'+nl+
	'    \'village\' => 5,'+nl+
	'    \'hamlet\' => 6,'+nl+
	'    \'isolated_dwelling\' => 6,'+nl+
	'    \'locality\' => 6,'+nl+
	'    \'islet\' => 6,'+nl+
	'    \'farm\' => 6,'+nl+
	'  }'+nl+
	'  '+nl+
	'  place_parts = place_string.strip.split(\' \').reverse'+nl+
	'  unrecognized_parts = []'+nl+nl+
	'  s2c_debug_log("place_parts=\'%s\'" % place_parts.inspect)'+nl+nl+
	'  parts_count = [place_parts.length, 4].min'+nl+
	'  '+nl+
	'  while place_parts.length > 0 do'+nl+
	'  '+nl+
	'    if parts_count < 1'+nl+
	'      unrecognized_token = place_parts.shift(1)'+nl+
	'      s2c_debug_log("unrecognized_token \'%s\'" % unrecognized_token)'+nl+
	'      unrecognized_parts.push(unrecognized_token)'+nl+
	'      parts_count = [place_parts.length, 4].min'+nl+
	'    end'+nl+
	'  '+nl+
	'    candidate_name = place_parts[0..(parts_count-1)].reverse.join(\' \')'+nl+
	'    parts_count -= 1'+nl+nl+
	'    s2c_debug_log("candidate_name=\'%s\'" % candidate_name)'+nl+
	'    s2c_debug_log("parts_count=\'%d\'" % parts_count)'+nl+nl+
	'    location_select = \'SELECT name,place\'+'+nl+
	'      \',ST_Y(way::geometry) as latitude, ST_X(way::geometry) AS longitude\'+'+nl+
	'      \' FROM "uk_osm_point" WHERE lower(name)=lower(\\\'\'+candidate_name+\'\\\');\''+nl+nl+
	'    s2c_debug_log("location_select=\'%s\'" % location_select.inspect)'+nl+nl+
	'    location_hashes = select_as_hashes(location_select, DSTKConfig::REVERSE_GEO_DATABASE)'+nl+
	'  '+nl+
	'    if !location_hashes or location_hashes.length == 0'+nl+
	'      s2c_debug_log("No matches found for \'%s\'" % candidate_name)'+nl+
	'      next'+nl+
	'    end'+nl+
	'  '+nl+
	'    # Rank the results either by the size of the area they represent, or their distance'+nl+
	'    # from other identified parts of the address if any have been found'+nl+
	'    candidate_hashes = []'+nl+
	'    location_hashes.each do |location_hash|'+nl+
	'    '+nl+
	'      place = location_hash[\'place\']'+nl+
	'      '+nl+
	'      # If we don\'t recognize this place type, skip it'+nl+
	'      if !place_ranking.has_key?(place)'+nl+
	'        s2c_debug_log("Unknown place \'%s\' found for \'%s\'" % [place, candidate_name])'+nl+
	'        next'+nl+
	'      end'+nl+
	'      '+nl+
	'      candidate_confidence = place_ranking[place]'+nl+
	'    '+nl+
	'      # We\'ve already found a place, so use that as a reference'+nl+
	'      if info      '+nl+
	'        # Get an approximate distance measure. This is pretty distorted, but workable'+nl+
	'        # as a scoring mechanism'+nl+
	'        delta_lat = info[:latitude].to_f-location_hash[\'latitude\'].to_f'+nl+
	'        delta_lon = info[:longitude].to_f-location_hash[\'longitude\'].to_f'+nl+
	'        score = (delta_lat*delta_lat) + (delta_lon*delta_lon)'+nl+
	'      else'+nl+
	'        score = place_ranking[place]'+nl+
	'      end'+nl+
	'      '+nl+
	'      candidate_hashes.push({'+nl+
	'        :name => location_hash[\'name\'],'+nl+
	'        :latitude => location_hash[\'latitude\'],'+nl+
	'        :longitude => location_hash[\'longitude\'],'+nl+
	'        :place => place,'+nl+
	'        :score => score,'+nl+
	'        :confidence => candidate_confidence,'+nl+
	'      })'+nl+
	'      '+nl+
	'    end'+nl+
	'  '+nl+
	'    # No valid locations with valid place types were found, so move along'+nl+
	'    if candidate_hashes.length == 0'+nl+
	'      s2c_debug_log("No valid matches found for \'%s\'" % candidate_name)'+nl+
	'      next'+nl+
	'    end'+nl+
	'    '+nl+
	'    sorted_candidates = candidate_hashes.sort do |a,b| a[:score]<=>b[:score] end'+nl+nl+
	'    top_candidate = sorted_candidates[0]'+nl+
	'    '+nl+
	'    # Now try to update what we know with the new information'+nl+
	'    if !info'+nl+
	'      info = {'+nl+
	'        :latitude => nil,'+nl+
	'        :longitude => nil,'+nl+
	'        :country_code => \'UK\','+nl+
	'        :country_code3 => \'GBR\','+nl+
	'        :country_name => \'United Kingdom\','+nl+
	'        :region => nil,'+nl+
	'        :locality => nil,'+nl+
	'        :street_address => nil,'+nl+
	'        :street_number => nil,'+nl+
	'        :street_name => nil,'+nl+
	'        :confidence => -1,'+nl+
	'        :fips_county => nil'+nl+
	'      }'+nl+
	'    end'+nl+
	'    '+nl+
	'    old_confidence = info[:confidence]'+nl+
	'    candidate_confidence = top_candidate[:confidence]'+nl+
	'    if candidate_confidence > old_confidence'+nl+
	'      '+nl+
	'      info[:latitude] = top_candidate[:latitude]'+nl+
	'      info[:longitude] = top_candidate[:longitude]'+nl+
	'      info[:confidence] = candidate_confidence'+nl+nl+
	'      name = top_candidate[:name]'+nl+
	'      place = top_candidate[:place]'+nl+
	'      if place == \'county\''+nl+
	'        info[:region] = name'+nl+
	'      else'+nl+
	'        info[:locality] = name'+nl+
	'      end'+nl+nl+
	'      s2c_debug_log("Updating info to \'%s\' for \'%s\'" % [info.inspect, candidate_name])'+nl+
	'  '+nl+
	'    end'+nl+
	'    '+nl+
	'    # Remove the matched parts, and start matching anew on the remainder'+nl+
	'    place_parts.shift(parts_count+1)'+nl+
	'    parts_count = [place_parts.length, 4].min'+nl+
	'    unrecognized_parts = []  '+nl+nl+
	'  end'+nl+nl+
	'  unrecognized_prefix = unrecognized_parts.reverse.join(\' \')'+nl+
	'  '+nl+
	'  s2c_debug_log("unrecognized_prefix=\'%s\'" % unrecognized_prefix)'+nl+
	'  '+nl+
	'  if !street_string'+nl+
	'    street_string = unrecognized_prefix.strip'+nl+
	'  end'+nl+
	'  '+nl+
	'  # If we found a general location, see if we can narrow it down using the street'+nl+
	'  if info and street_string and street_string.length > 0'+nl+
	'  '+nl+
	'    street_string = canonicalize_street_string(street_string)'+nl+
	'    street_parts = street_string.strip.split(\' \').reverse'+nl+nl+
	'    s2c_debug_log("street_parts=\'%s\'" % street_parts.inspect)'+nl+nl+
	'    parts_count = [street_parts.length, 4].min'+nl+
	'    '+nl+
	'    while street_parts.length > 0 do'+nl+
	'    '+nl+
	'      if parts_count < 1'+nl+
	'        unrecognized_token = street_parts.shift(1)'+nl+
	'        s2c_debug_log("unrecognized_token \'%s\'" % unrecognized_token)'+nl+
	'        parts_count = [street_parts.length, 4].min'+nl+
	'      end'+nl+
	'    '+nl+
	'      candidate_name = street_parts[0..(parts_count-1)].reverse.join(\' \')'+nl+
	'      parts_count -= 1'+nl+nl+
	'      s2c_debug_log("candidate_name=\'%s\'" % candidate_name)'+nl+
	'      s2c_debug_log("parts_count=\'%d\'" % parts_count)'+nl+nl+
	'      point_string = \'setsrid(makepoint(\'+PGconn.escape(info[:longitude])+\', \'+PGconn.escape(info[:latitude])+\'), 4326)\''+nl+nl+
	'      distance = 0.1'+nl+
	'      road_select = \'SELECT name\'+'+nl+
	'        \',ST_Y(ST_line_interpolate_point(way,ST_line_locate_point(way,\'+point_string+\'))::geometry) AS latitude,\'+'+nl+
	'        \' ST_X(ST_line_interpolate_point(way,ST_line_locate_point(way,\'+point_string+\'))::geometry) AS longitude\'+'+nl+
	'        \' FROM "uk_osm_line" WHERE lower(name)=lower(\\\'\'+candidate_name+\'\\\')\'+'+nl+
	'        \' AND ST_DWithin(\'+'+nl+
	'        point_string+'+nl+
	'        \', way, \'+'+nl+
	'        distance.to_s+'+nl+
	'        \') ORDER BY ST_Distance(\'+'+nl+
	'        point_string+'+nl+
	'        \', way) LIMIT 1;\''+nl+nl+
	'      s2c_debug_log("road_select=\'%s\'" % road_select.inspect)'+nl+nl+
	'      road_hashes = select_as_hashes(road_select, DSTKConfig::REVERSE_GEO_DATABASE)'+nl+
	'    '+nl+
	'      if !road_hashes or road_hashes.length == 0'+nl+
	'        s2c_debug_log("No matches found for \'%s\'" % candidate_name)'+nl+
	'        next'+nl+
	'      end'+nl+
	'    '+nl+
	'      top_candidate = road_hashes[0]'+nl+
	'        '+nl+
	'      info[:latitude] = top_candidate[\'latitude\']'+nl+
	'      info[:longitude] = top_candidate[\'longitude\']'+nl+
	'      info[:confidence] = [info[:confidence], 8].max'+nl+
	'      info[:street_name] = top_candidate[\'name\']'+nl+nl+
	'      # Remove the matched parts'+nl+
	'      street_parts.shift(parts_count+1)'+nl+
	'      unrecognized_street = street_parts.reverse.join(\' \')'+nl+
	'      '+nl+
	'      street_number = /\\d+[a-z]?/i.match(unrecognized_street)'+nl+
	'      if street_number'+nl+
	'        info[:street_number] = street_number.to_s'+nl+
	'        info[:street_address] = info[:street_number]+\' \'+info[:street_name]'+nl+
	'      end'+nl+nl+
	'      s2c_debug_log("Updating info to \'%s\' for \'%s\'" % [info.inspect, candidate_name])'+nl+
	'    '+nl+
	'      # We\'ve found a street, so stop looking'+nl+
	'      break'+nl+
	'    end'+nl+nl+
	'    s2c_debug_log("unrecognized_street=\'%s\'" % unrecognized_street)    '+nl+
	'  '+nl+
	'  end'+nl+nl+
	'  info'+nl+
	'end'+nl+nl+
	'def canonicalize_street_string(street_string)'+nl+nl+
	'  output = street_string'+nl+nl+
	'  abbreviation_mappings = {'+nl+
	'    \'Street\' => [\'St\'],'+nl+
	'    \'Drive\' => [\'Dr\'],'+nl+
	'    \'Avenue\' => [\'Ave\', \'Av\'],'+nl+
	'    \'Court\' => [\'Ct\'],'+nl+
	'    \'Road\' => [\'Rd\'],'+nl+
	'    \'Lane\' => [\'Ln\'],'+nl+
	'    \'Place\' => [\'Pl\'],'+nl+
	'    \'Boulevard\' => [\'Blvd\'],'+nl+
	'    \'Highway\' => [\'Hwy\'],'+nl+
	'    \'Row\' => [\'Rw\'],'+nl+
	'  }'+nl+
	'  '+nl+
	'  abbreviation_mappings.each do |canonical, abbreviations|'+nl+
	'  '+nl+
	'    abbreviations_re = Regexp.new(\'^(.*[a-z]+.*)(\'+abbreviations.join(\'|\')+\')([^a-z]*)$\', Regexp::IGNORECASE)'+nl+
	'    output.gsub!(abbreviations_re, \'\\1\'+canonical+\'\\3\')'+nl+
	'  '+nl+
	'  end'+nl+nl+
	'  output'+nl+
	'end'+nl+nl+
	'if __FILE__ == $0'+nl+
	'  test_text = <<-TEXT'+nl+
	'2543 Graystone Place, Simi Valley, CA 93065'+nl+
	'11 Meadow Lane, Over, Cambridge CB24 5NF'+nl+
	'400 Duboce Ave, San Francisco, CA 94117'+nl+
	'TEXT'+nl+nl+
	'  test_text.each_line do |line|'+nl+
	'    output = street2coordinates(line)'+nl+
	'    puts line'+nl+
	'    if output'+nl+
	'      puts JSON.pretty_generate(output)'+nl+
	'    end'+nl+
	'    puts \'************\''+nl+
	'  end'+nl+nl+
	'end'

document.write(pagecode);

</script>