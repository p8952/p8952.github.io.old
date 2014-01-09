require 'erb'

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

	Dir.glob('templates/posts/*.html') do |page|
		page_content = ERB.new(File.read(page)).result
		File.write("pages/posts/#{File.basename(page, '.html')}.html", ERB.new(layout).result(ERBVar.instance_eval { binding }))
	end

end
