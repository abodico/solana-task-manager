use anchor_lang::prelude::*;

use crate::constants::TASK_SEED;
use crate::state::TaskAccount;

#[derive(Accounts)]
#[instruction(task_id: u64)]
pub struct DeleteTask<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [
            TASK_SEED,
            authority.key().as_ref(),
            task_id.to_le_bytes().as_ref()
        ],
        bump,
        has_one = authority,
        constraint = task.task_id == task_id,
        close = authority
    )]
    pub task: Account<'info, TaskAccount>,
}

pub fn handle_delete_task(_ctx: Context<DeleteTask>, _task_id: u64) -> Result<()> {
    Ok(())
}
