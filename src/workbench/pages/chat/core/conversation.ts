export interface IConversation {
  id: string
  name: string
}

const BLANK_CONVERSATION = {
  id: 'BLANK_CONVERSATION',
  name: '新会话'
}

interface ConversationOptions {
  callbacks?: {
    onConversationChange?: (conversation: IConversation) => void
  }
}

export class Conversation {
  list: IConversation[] = []
  currentConversation: IConversation

  constructor(private readonly options: ConversationOptions) {
    this.list = []
    this.currentConversation = BLANK_CONVERSATION
  }
  
  init() {
    // TODO load conversation list
  }

  createBlankConversation() {
    this.currentConversation = BLANK_CONVERSATION
    this.options.callbacks?.onConversationChange?.(this.currentConversation)
  }
  
  conversationCreate() {
    // TODO 调用接口将Blank的会话创建为正式的
  }
}