;(function(){
	$.Editor.toolbar.add('|');

	var counter=0;
	var upload=function(input,callback,uploadURL){
	
		var url=uploadURL||'/supplier/richUpload.action';
	
		var el=$(input);
		el.attr("name","imgFile");
		
		var key='qeditor-upload-iframe-'+([(new Date()).valueOf(),counter++].join(''));
		
		var msg=$('<p></p>');
	
		var form=$('<form style="display: none; left: -10000px; top: -10000px;" action="'+url+'?dir=image" target="'+key+'" enctype="multipart/form-data" method="post"></form>');
		var iframe=$('<iframe name="'+key+'" style="display: none"></iframe>');
		
		var webkitfirstload=$.browser.webkit;
			//webkit内核下会load两次
		
		iframe.bind('load',function(){
		
			if(webkitfirstload){
				webkitfirstload=false;
				return;
			}
		
			setTimeout(function(){
				el.val('');
				el.insertBefore(msg);
				msg.remove();
				form.remove();
				iframe.remove();
			},3000);
		
			var ret=$.trim($(iframe[0].contentWindow.document.body).text());
			try{
				var rdata=(new Function('return '+ret+';'))();
			}catch(e){
				var rdata={error:1};
			}
			
			if(rdata.error){
				msg.text(rdata.message||'上传失败...');
			}else{
				msg.text('上传成功!');
			}
			
			callback(rdata);
		});
		
		msg.text('上传中...');
		msg.insertBefore(el);
		//form.insertBefore(el);
		form.appendTo(document.body);
		iframe.insertBefore(form);
		el.appendTo(form);
		form.submit();
	}

	$.Editor.toolbar.add('image',{
		render: function(){
			var html=['<div class="qeditor-image" -qeditor-toolbar-item-="image">'];
			
			html.push('<div -qeditor-toolbar-menu-="image" style="display: none">');
			html.push('<ul class="qeditor-toolbar-tab">','<li class="current" item="tab">本地上传</li>','<li item="tab">远程文件</li>','</ul>');
			
			html.push('<div class="qeditor-tab-panel" item="panel">');
			html.push('<input type="file" -qeditor-toolbar-input-="image-file" -usedefault-="1" />');
			html.push('<button -qeditor-toolbar-button-="upload" -usedefault-="1" type="button">确定</button>');
			html.push('</div>');
			
			html.push('<div class="qeditor-tab-panel" item="panel" style="display: none">');
			html.push('<input type="text" -qeditor-toolbar-input-="image-url" -usedefault-="1" />');
			html.push('<button -qeditor-toolbar-button-="use-url" -usedefault-="1" type="button">确定</button>');
			html.push('</div>');
			
			html.push('</div>');
			
			html.push('</div>');
			
			return html.join('');
		},
		
		init: function(editor,el){
			var menu=el.find('[-qeditor-toolbar-menu-="image"]');
			
			var uploadbtn=el.find('[-qeditor-toolbar-button-="upload"]');
			var fileinput=el.find('[-qeditor-toolbar-input-="image-file"]');
			
			this.regMenu(menu,editor,{				
				show: function(){
					editor.focus();
					editor.range.cache();
					
					if($.browser.msie){
						fileinput.focus();
					}
				},
				hide: function(){
					editor.range.use();
					editor.focus();
				}
			});
			
			el.bind("mousedown",function(e){
						
				if(e.target==el[0]||(e.target.tagName=="IMG"&&e.target.parentNode==el[0])){
					menu.show();
				}
			});
			
			var tabs=el.find('[item="tab"]');
			var panels=el.find('[item="panel"]');
			
			tabs.each(function(index){
				var tab=$(this);
				tab.bind('click',function(){
				
					tabs.removeClass("current");
					tabs.eq(index).addClass("current");
				
					panels.hide();
					panels.eq(index).show();
				});
			});
			uploadbtn.bind('click',function(){
			
				if(!fileinput.val()){
					return;
				}
			
				upload(fileinput,function(data){
					if(!data.error&&data.url){
						menu.hide();
						setTimeout(function(){
							editor.insertHTML('<img src="'+data.url+'" />');
						},30);
					}
				},editor.config.uploadURL);
			});
		}
	});
	
	$.Editor.toolbar.add('|');
	
	$.Editor.toolbar.add('fullscreen',{
		render: function(){
			return '<div class="qeditor-image" -qeditor-toolbar-item-="fullscreen"></div>';
		},
		
		init: function(editor,el){
			el.bind('click',function(){
				//console.log(editor.fullscreen);
				
				if(parent.QNR.event){
					parent.QNR.event.trigger("fullscreen");
				}
				
				setTimeout(function(){
					try{
						editor.fullscreen();
					}catch(e){
						console.log(e);
					}
				},15);
			});
		}
	});
	
	$.Editor.toolbar.add('showcode',{
		render: function(){
			return '<div class="qeditor-image" -qeditor-toolbar-item-="fullscreen"></div>';
		},
		
		init: function(editor,el){
			el.bind('click',$.proxy(function(){
			},editor));
		}
	});
})();