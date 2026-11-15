use anchor_lang::prelude::*;

use crate::constants::TASK_SEED;
use crate::error::TaskManagerError;
use crate::state::TaskAccount;

#[derive(Accounts)]
#[instruction(task_id: u64)]
pub struct CompleteTask<'info> {
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
        constraint = task.task_id == task_id
    )]
    pub task: Account<'info, TaskAccount>,
}

pub fn handle_complete_task(ctx: Context<CompleteTask>, _task_id: u64) -> Result<()> {
    let task = &mut ctx.accounts.task;
    require!(!task.completed, TaskManagerError::TaskAlreadyCompleted);

    task.completed = true;
    Ok(())
}
