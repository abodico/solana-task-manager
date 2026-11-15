use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Counter {
    pub count: u64,
    pub authority: Pubkey,
}

#[account]
#[derive(InitSpace)]
pub struct UserProfile {
    pub authority: Pubkey,
    pub task_count: u64,
}

#[account]
#[derive(InitSpace)]
pub struct TaskAccount {
    pub authority: Pubkey,
    pub task_id: u64,

    #[max_len(50)]
    pub title: String,

    #[max_len(200)]
    pub description: String,

    pub completed: bool,
}
