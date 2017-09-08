$(function() {
  $.post('/messages', function(data) {
		// $('#debug').html(JSON.stringify(data,null,2))
		data.forEach(message => {
			$('.log-messages').append(() => {
				let messageElem = $('<div class="message-entry">')
				let messageAvatar = $('<img src="' + (message.avatar != null ? message.avatar : "/public/img/no-avatar.png")		 + '">').appendTo(messageElem)
				let messageInner = $('<div class="inner">')
				let messageHeader = $('<h3 class="title">')
				let messageContent = $('<div class="content">')

				messageHeader.html(
					'<span title="UserId: ' + message.userId + '">'+message.username + ' <small><span class="muted"><i> in <span title="Channel">' + message.channel + "</span></i></span> " + '<span class="time" title="Timestamp: ' + message.createdAt + '">'+ $.timeago(message.createdAt) +'</span>' + "</small>"
				)
				messageContent.html(message.content)

				messageHeader.add(messageContent).appendTo(messageInner)
				messageInner.appendTo(messageElem)
				return messageElem
			})
		})
  });
})
