require 'erb'
require 'kramdown'

task :default => :build

task :build do

	module ERBVar
		def self.page_info
		end
	end

	layout = File.read('layout.erb')

	Dir.glob('templates/*.html') do |page|
		page_content = ERB.new(File.read(page)).result
		File.write("pages/#{File.basename(page, '.html')}.html", ERB.new(layout).result(ERBVar.instance_eval { binding }))
	end

	Dir.glob('templates/posts/*.md') do |page|
		page_content = ERB.new(Kramdown::Document.new(File.readlines(page)[3..-1].join).to_html).result
		File.write("pages/posts/#{File.basename(page, '.md')}.html", ERB.new(layout).result(ERBVar.instance_eval { binding }))
	end

end
